<?php
session_start();
function h(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
$message = $_SESSION['message'] ?? '';
unset($_SESSION['message']);
try {
    $pdo = require __DIR__ . '/db.php';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $token = $_POST['csrf'] ?? '';
        if (!is_string($token) || !hash_equals($_SESSION['csrf'], $token)) {
            http_response_code(403);
            exit('الطلب غير صالح. أعد تحميل الصفحة.');
        }
        $action = $_POST['action'] ?? '';
        $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
        $mark = filter_var($_POST['mark'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 0, 'max_range' => 100]]);
        $rawName = $_POST['name'] ?? '';
        $name = is_string($rawName) ? trim($rawName) : '';
        if ($action === 'add' && $name !== '' && preg_match('/^.{1,100}$/us', $name) && $mark !== false) {
            $stmt = $pdo->prepare('INSERT INTO students (name, mark) VALUES (?, ?)');
            $stmt->execute([$name, $mark]);
            $_SESSION['message'] = 'تمت إضافة الطالب.';
        } elseif ($action === 'update' && $id !== false && $mark !== false) {
            $stmt = $pdo->prepare('UPDATE students SET mark = ? WHERE id = ?');
            $stmt->execute([$mark, $id]);
            $_SESSION['message'] = 'تم تنفيذ طلب التعديل.';
        } elseif ($action === 'delete' && $id !== false) {
            $stmt = $pdo->prepare('DELETE FROM students WHERE id = ?');
            $stmt->execute([$id]);
            $_SESSION['message'] = 'تم تنفيذ طلب الحذف.';
        } else {
            $_SESSION['message'] = 'تحقق من الاسم (1 إلى 100 حرف) والعلامة (عدد صحيح من 0 إلى 100).';
        }
        header('Location: index.php', true, 303);
        exit;
    }
    $students = $pdo->query('SELECT id, name, mark FROM students ORDER BY id DESC LIMIT 100')->fetchAll();
} catch (PDOException $error) {
    error_log($error->getMessage());
    http_response_code(500);
    exit('تعذر الاتصال أو تنفيذ العملية. راجع دليل التشغيل وبيانات db.php وسجل أخطاء الخادم.');
}
?>
<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>مختبر سجل الطلبة</title>
<style>body{font:18px/1.8 Tahoma,sans-serif;max-width:950px;margin:30px auto;padding:20px;color:#18324a;background:#f4f7fb}section,article{background:white;border:1px solid #d9e4ef;border-radius:8px;padding:20px;margin:18px 0}form{display:flex;gap:12px;flex-wrap:wrap;align-items:center}label{display:block}input,button{font:inherit;padding:8px;max-width:100%}button{background:#004d99;color:white;border:0;border-radius:4px;cursor:pointer}.delete{background:#9b2525}:focus-visible{outline:3px solid #b45309;outline-offset:3px}input[type=number]{width:90px}</style></head><body>
<h1>مختبر سجل الطلبة</h1><p>تطبيق تدريبي محلي · PHP وMySQL · لا تدخل بيانات طلبة حقيقية.</p>
<p role="status"><?= h($message) ?></p>
<section><h2>إضافة طالب</h2><form method="post">
<input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>"><input type="hidden" name="action" value="add">
<label>الاسم <input name="name" required maxlength="100"></label><label>العلامة <input type="number" name="mark" min="0" max="100" step="1" required></label><button>إضافة</button>
</form></section>
<h2>آخر 100 سجل</h2>
<?php if (!$students): ?><p>لا توجد سجلات بعد. أضف طالباً تجريبياً.</p><?php endif; ?>
<?php foreach ($students as $student): ?>
<article><h3><?= h($student['name']) ?> · رقم <?= (int)$student['id'] ?></h3>
<form method="post"><input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>"><input type="hidden" name="id" value="<?= (int)$student['id'] ?>"><input type="hidden" name="action" value="update"><label>العلامة الجديدة <input type="number" name="mark" min="0" max="100" step="1" required value="<?= (int)$student['mark'] ?>"></label><button>حفظ التعديل</button></form>
<details><summary>حذف هذا السجل</summary><p>سيحذف السجل من قاعدة التدريب.</p><form method="post"><input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>"><input type="hidden" name="id" value="<?= (int)$student['id'] ?>"><input type="hidden" name="action" value="delete"><button class="delete">تأكيد الحذف</button></form></details></article>
<?php endforeach; ?>
</body></html>
