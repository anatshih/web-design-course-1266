function copyCode(btn) {
    // العثور على عنصر الكود (pre) الموجود في نفس الصندوق
    const pre = btn.closest('.code-box').querySelector('pre');
    const code = pre.innerText;

    // نسخ النص إلى الحافظة
    navigator.clipboard.writeText(code).then(() => {
        // تغيير نص الزر مؤقتاً لتأكيد النسخ
        const originalText = btn.innerText;
        btn.innerText = "تم النسخ!";
        btn.style.background = "#28a745"; // لون أخضر
        btn.style.borderColor = "#28a745";

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "transparent";
            btn.style.borderColor = "#777";
        }, 2000);
    }).catch(err => {
        console.error('فشل النسخ', err);
    });
}