<?php
// غيّر هذه القيم لتطابق مستخدم قاعدة التدريب المحلي.
return new PDO(
    'mysql:host=127.0.0.1;dbname=course1266;charset=utf8mb4',
    'course_student',
    'change-this-local-password',
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
     PDO::ATTR_EMULATE_PREPARES => false]
);
