@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ==== SERVIS SAATLERI KURULUM ====
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js kurulu degil. Acilan sayfadan LTS surumunu indirip kurun,
  echo sonra bu dosyaya TEKRAR cift tiklayin.
  start https://nodejs.org
  pause
  exit /b
)
echo [1/4] Paketler kuruluyor, bekleyin...
call npm install
if errorlevel 1 goto hata
echo.
echo [2/4] Cloudflare girisi: tarayici acilacak. Giris yapip ALLOW deyin.
call npx wrangler login
if errorlevel 1 goto hata
echo.
echo [3/4] Yukleniyor...
echo (Alt alan adi sorarsa kisa bir isim yazin, ornek: megasaray)
call npx wrangler deploy
if errorlevel 1 goto hata
echo.
echo [4/4] Yonetici sifresini yazin (en az 6 karakter) ve Enter'a basin.
echo Yazarken ekranda gorunmez. Kullanici adiniz: admin
call npx wrangler secret put ADMIN_PASSWORD
if errorlevel 1 goto hata
echo.
echo ==== BITTI ====
echo Yukaridaki yazilardan https://....workers.dev adresinizi bulun.
echo   Yonetici : ADRES/admin.html
echo   Sofor    : ADRES/driver.html
echo.
pause
exit /b
:hata
echo.
echo Bir hata oldu. Bu penceredeki yaziyi kopyalayip Claude'a gonderin.
pause
