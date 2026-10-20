<?php
header('Content-Type: text/plain; charset=utf-8');
try {
 $pdo = require __DIR__ . '/db.php';
 $count = (int)$pdo->query('SELECT COUNT(*) FROM students')->fetchColumn();
 echo "تم الاتصال بقاعدة التدريب بنجاح\nعدد السجلات: " . $count;
} catch (PDOException $error) {
 error_log($error->getMessage());
 http_response_code(500);
 echo "لم يكتمل الفحص. راجع تشغيل MySQL وdb.php واستيراد schema.sql وامتداد pdo_mysql. التفاصيل في سجل الخادم المحلي.";
}
