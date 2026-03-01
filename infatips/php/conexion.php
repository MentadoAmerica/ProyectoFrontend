<?php
// Configuración de la base de datos
$servidor = "localhost";
$usuario = "root";  // En XAMPP usualmente es "root"
$password = "";      // En XAMPP usualmente está vacío
$base_datos = "infosalud_db";

// Crear conexión
$conn = new mysqli($servidor, $usuario, $password, $base_datos);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer charset para evitar problemas con acentos
$conn->set_charset("utf8");

// Iniciar sesión para mantener datos del usuario
session_start();
?>