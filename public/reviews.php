<?php
/**
 * Dynamic Reviews Handler for standard shared hosting (ISPmanager / Apache / Nginx)
 * Manages GET (retrieve reviews), POST (submit a review), and Admin operations (delete / update reviews).
 */

// CORS headers to make local testing or cross-domain requests easy
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$file = __DIR__ . '/reviews_data.json';

/**
 * Safe lock-protected read of reviews file. Falls back to realistic defaults if not present.
 */
function readReviews($filePath) {
    $defaults = [
        [
            "id" => "test-1",
            "author" => "Елена Васильевна Корнеева",
            "role" => "Сотрудник ФТС России, г. Москва",
            "rating" => 5,
            "text" => "Замечательный санаторий! Парк просто сказочный, воздух такой плотный и ароматный от сосен, что кружится голова. Лечебный корпус оборудован по последнему слову техники. Персонал вежливый, внимательный. Номера полулюкс с панорамным видом на море — это любовь с первого взгляда. Обязательно приедем еще раз!",
            "date" => "15 мая 2026"
        ],
        [
            "id" => "test-2",
            "author" => "Сергей и Наталья Смирновы",
            "role" => "Семья отдыхающих, г. Санкт-Петербург",
            "rating" => 5,
            "text" => "Проходили программу «Здоровое дыхание». Муж страдал от хронического кашля после ковида, уже через 5 дней ингаляций и прогулок по терренкуру кашель практически прекратился! Питание отличное, шведский стол разнообразный и очень вкусный. Пляж чистый, вода кристальная, лифт на пляж очень удобный. Рекомендуем всем!",
            "date" => "28 апреля 2026"
        ],
        [
            "id" => "test-3",
            "author" => "Михаил Юрьевич Дёмин",
            "role" => "Ветеран таможенной службы, г. Ростов-на-Дону",
            "rating" => 5,
            "text" => "Прекрасный медицинский подход. Врачи высокой квалификации, не просто дежурно выписывают процедуры, а вдумчиво подбирают индивидуальный курс. Грязевые аппликации на колени очень помогли, суставы теперь не болят. Санаторий тихий, располагает к спокойному, глубокому восстановлению.",
            "date" => "10 марта 2026"
        ]
    ];

    if (!file_exists($filePath)) {
        // Create the file with defaults
        file_put_contents($filePath, json_encode($defaults, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
        return $defaults;
    }

    $content = file_get_contents($filePath);
    if ($content === false) {
        return $defaults;
    }

    $data = json_decode($content, true);
    if (!is_array($data)) {
        return $defaults;
    }

    return $data;
}

/**
 * Safe lock-protected write of reviews file
 */
function writeReviews($filePath, $data) {
    $result = file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    return $result !== false;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $reviews = readReviews($file);
    echo json_encode($reviews, JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    // Read raw input
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    // Support standard form-urlencoded POST requests
    if (empty($input)) {
        $input = $_POST;
    }

    $action = isset($input['action']) ? $input['action'] : '';

    // Action: Delete a review (used by admin)
    if ($action === 'delete') {
        $id = isset($input['id']) ? trim($input['id']) : '';
        if (empty($id)) {
            http_response_code(400);
            echo json_encode(["error" => "ID is required to delete a review"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $reviews = readReviews($file);
        $newReviews = [];
        $found = false;
        foreach ($reviews as $rev) {
            if ($rev['id'] === $id) {
                $found = true;
                continue; // Skip the review to delete it
            }
            $newReviews[] = $rev;
        }

        if ($found) {
            writeReviews($file, $newReviews);
            echo json_encode(["success" => true, "message" => "Review deleted successfully", "reviews" => $newReviews], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Review not found"], JSON_UNESCAPED_UNICODE);
        }
        exit();
    }

    // Action: Save the whole list of reviews (e.g. from Admin state sync)
    if ($action === 'save_all') {
        $allReviews = isset($input['reviews']) ? $input['reviews'] : null;
        if (!is_array($allReviews)) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid reviews list received"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        // Clean reviews content
        $cleaned = [];
        foreach ($allReviews as $r) {
            $cleaned[] = [
                "id" => isset($r['id']) ? htmlspecialchars(trim($r['id']), ENT_QUOTES, 'UTF-8') : "test-user-" . uniqid(),
                "author" => isset($r['author']) ? htmlspecialchars(trim($r['author']), ENT_QUOTES, 'UTF-8') : "Аноним",
                "role" => isset($r['role']) ? htmlspecialchars(trim($r['role']), ENT_QUOTES, 'UTF-8') : "Гость санатория",
                "rating" => isset($r['rating']) ? intval($r['rating']) : 5,
                "text" => isset($r['text']) ? htmlspecialchars(trim($r['text']), ENT_QUOTES, 'UTF-8') : "",
                "date" => isset($r['date']) ? htmlspecialchars(trim($r['date']), ENT_QUOTES, 'UTF-8') : date('j.m.Y')
            ];
        }

        if (writeReviews($file, $cleaned)) {
            echo json_encode(["success" => true, "reviews" => $cleaned], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to write data to storage"], JSON_UNESCAPED_UNICODE);
        }
        exit();
    }

    // Default Action: Add a new review from the website form
    $author = isset($input['author']) ? trim($input['author']) : '';
    $role = isset($input['role']) ? trim($input['role']) : '';
    $rating = isset($input['rating']) ? intval($input['rating']) : 5;
    $text = isset($input['text']) ? trim($input['text']) : '';

    if (empty($author) || empty($text)) {
        http_response_code(400);
        echo json_encode(["error" => "Поля Имя и Текст отзыва обязательны для заполнения"], JSON_UNESCAPED_UNICODE);
        exit();
    }

    if ($rating < 1 || $rating > 5) {
        $rating = 5;
    }

    // Format the date in Russian elegantly
    $months = [
        1 => 'января', 2 => 'февраля', 3 => 'марта', 4 => 'апреля', 
        5 => 'мая', 6 => 'июня', 7 => 'июля', 8 => 'августа', 
        9 => 'сентября', 10 => 'октября', 11 => 'ноября', 12 => 'декабря'
    ];
    $day = date('j');
    $monthNum = intval(date('n'));
    $year = date('Y');
    $dateStr = $day . ' ' . $months[$monthNum] . ' ' . $year;

    $newReview = [
        "id" => "test-user-" . round(microtime(true) * 1000),
        "author" => htmlspecialchars($author, ENT_QUOTES, 'UTF-8'),
        "role" => !empty($role) ? htmlspecialchars($role, ENT_QUOTES, 'UTF-8') : "Гость санатория",
        "rating" => $rating,
        "text" => htmlspecialchars($text, ENT_QUOTES, 'UTF-8'),
        "date" => $dateStr
    ];

    $reviews = readReviews($file);
    // Prepend so newest is at the top
    array_unshift($reviews, $newReview);

    if (writeReviews($file, $reviews)) {
        echo json_encode(["success" => true, "new_review" => $newReview, "reviews" => $reviews], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Не удалось сохранить отзыв из-за внутренней ошибки записи на сервере"], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

// Any other request methods are not supported
http_response_code(405);
echo json_encode(["error" => "Method not allowed"], JSON_UNESCAPED_UNICODE);
exit();
