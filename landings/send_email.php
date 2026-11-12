<?php

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'message' => 'Método no permitido.'
    ]);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if (
    $name === '' ||
    $message === '' ||
    !filter_var($email, FILTER_VALIDATE_EMAIL)
) {
    http_response_code(422);
    echo json_encode([
        'message' => 'Completa correctamente los campos requeridos.'
    ]);
    exit;
}

// Configuración
$to = 'tucorreo@tudominio.com';
$subject = 'Nuevo mensaje desde el landing page';

// Construir contenido
$body = "
Nuevo mensaje recibido:

Nombre: $name
Correo: $email
Teléfono: $phone

Mensaje:
$message
";

// IMPORTANTE: utilizar un correo de tu propio dominio
$headers = [];
$headers[] = 'From: Landing Page <no-reply@tudominio.com>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = mail(
    $to,
    $subject,
    $body,
    implode("\r\n", $headers)
);

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Correo enviado correctamente.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'message' => 'No fue posible enviar el correo.'
    ]);
}