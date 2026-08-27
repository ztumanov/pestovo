<?php
/**
 * Dynamic Site Settings Handler for standard shared hosting (ISPmanager / Apache / Nginx / PHP)
 * Manages POST (save site settings securely) and GET (verify server capability or check status).
 */

@ini_set('memory_limit', '256M');
@ini_set('post_max_size', '64M');
@ini_set('upload_max_filesize', '64M');
@ini_set('max_execution_time', '120');

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$file = __DIR__ . '/site-data.json';

/**
 * Default administrative users list if site-data.json does not exist yet.
 * This MUST match the defaults in the React application.
 */
$defaultUsers = [
    [
        "id" => "user-1",
        "username" => "admin",
        "password" => "admin2026",
        "role" => "Главный Администратор"
    ],
    [
        "id" => "user-2",
        "username" => "daniliv",
        "password" => "admin",
        "role" => "и.о. Начальника санатория"
    ]
];

/**
 * Check if the username and password match any authorized user.
 */
function authenticate($username, $password, $filePath, $defaultUsers) {
    if (empty($username) || empty($password)) {
        return false;
    }

    $users = $defaultUsers;

    // Try to read users from the existing site-data.json file on the server
    if (file_exists($filePath)) {
        $content = @file_get_contents($filePath);
        if ($content !== false) {
            $data = json_decode($content, true);
            if (is_array($data) && isset($data['users']) && is_array($data['users']) && !empty($data['users'])) {
                $users = $data['users'];
            }
        }
    }

    $lowerUser = strtolower(trim($username));
    foreach ($users as $user) {
        if (isset($user['username']) && isset($user['password'])) {
            if (strtolower(trim($user['username'])) === $lowerUser && $user['password'] === $password) {
                return true;
            }
        }
    }

    return false;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // GET request checks if settings file exists and returns metadata
    $exists = file_exists($file);
    $writable = is_writable(__DIR__) || ($exists && is_writable($file));
    $fileSize = $exists ? @filesize($file) : 0;
    
    echo json_encode([
        "status" => "online",
        "file_exists" => $exists,
        "writable" => $writable,
        "file_size_bytes" => $fileSize,
        "php_version" => phpversion()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    // Read raw input or POST form
    $inputJSON = @file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (empty($input) && !empty($_POST)) {
        $input = $_POST;
        if (isset($input['siteData']) && is_string($input['siteData'])) {
            $input['siteData'] = json_decode($input['siteData'], true);
        }
    }

    if (empty($input)) {
        http_response_code(400);
        echo json_encode(["error" => "Получено пустое тело запроса (Empty request body)."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';
    $siteData = isset($input['siteData']) ? $input['siteData'] : (isset($input['resortInfo']) ? $input : null);

    // If credentials are provided, verify them
    if (!empty($username) || !empty($password)) {
        if (!authenticate($username, $password, $file, $defaultUsers)) {
            http_response_code(403);
            echo json_encode(["error" => "Ошибка авторизации: неверный логин или пароль администратора."], JSON_UNESCAPED_UNICODE);
            exit();
        }
    }

    if (empty($siteData) || !is_array($siteData)) {
        http_response_code(400);
        echo json_encode(["error" => "Некорректные данные настроек (siteData)."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // Optional: merge testimonials if they aren't provided in the incoming save
    // but we have them in the existing reviews_data.json
    $reviewsFile = __DIR__ . '/reviews_data.json';
    if (!isset($siteData['testimonials']) || empty($siteData['testimonials'])) {
        if (file_exists($reviewsFile)) {
            $reviewsContent = @file_get_contents($reviewsFile);
            if ($reviewsContent !== false) {
                $reviewsList = json_decode($reviewsContent, true);
                if (is_array($reviewsList)) {
                    $siteData['testimonials'] = $reviewsList;
                }
            }
        }
    }

    $encoded = json_encode($siteData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($encoded === false) {
        http_response_code(500);
        echo json_encode(["error" => "Ошибка кодирования JSON: " . json_last_error_msg()], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // Write the site-data.json securely to the server with lock
    $result = @file_put_contents($file, $encoded, LOCK_EX);

    if ($result !== false) {
        @chmod($file, 0644);
        echo json_encode([
            "success" => true,
            "message" => "Настройки и медиа-ресурсы успешно сохранены на сервере!",
            "bytes_written" => $result,
            "timestamp" => date('Y-m-d H:i:s')
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Не удалось записать файл site-data.json. Проверьте права на запись в папку сайта."], JSON_UNESCAPED_UNICODE);
    }
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"], JSON_UNESCAPED_UNICODE);
exit();
