const express = require('express');
const app = express();

// Render / Railway asignan el puerto automáticamente
const port = process.env.PORT || 3000;

console.log('🚀 Iniciando servidor OAuth para Google Calendar...');

// Ruta para manejar el callback de OAuth2
app.get('/oauth2callback', (req, res) => {
    const code = req.query.code;
    const error = req.query.error;

    console.log('📥 Callback recibido:', { code: code?.substring(0, 20) + '...', error });

    if (error) {
        console.error('❌ Error en OAuth:', error);
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error en autorización</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .error { color: #d32f2f; background: #ffebee; padding: 15px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>❌ Error en la autorización</h1>
                <div class="error">
                    <p><strong>Error:</strong> ${error}</p>
                    <p>Por favor, intenta el proceso nuevamente desde WhatsApp.</p>
                </div>
            </body>
            </html>
        `);
        return;
    }

    if (code) {
        console.log('✅ Código de autorización recibido exitosamente');
        console.log('💬 Código para WhatsApp:', code);

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Autorización exitosa</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .success { color: #2e7d32; background: #e8f5e8; padding: 15px; border-radius: 5px; }
                    .code { background: #f5f5f5; padding: 15px; font-family: monospace; font-size: 16px; border: 2px solid #ddd; border-radius: 5px; margin: 15px 0; word-break: break-all; }
                    .copy-btn { background: #1976d2; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
                    .copy-btn:hover { background: #1565c0; }
                </style>
            </head>
            <body>
                <div class="success">
                    <h1>✅ ¡Autorización exitosa!</h1>
                    <p>Tu cuenta de Google Calendar ha sido autorizada correctamente.</p>
                </div>

                <h2>📋 Código de autorización:</h2>
                <p>Copia este código completo y pégalo en WhatsApp:</p>

                <div class="code" id="authCode">${code}</div>

                <button class="copy-btn" onclick="copyCode()">📋 Copiar código</button>

                <script>
                    function copyCode() {
                        const code = document.getElementById('authCode').textContent;
                        navigator.clipboard.writeText(code).then(() => {
                            const btn = document.querySelector('.copy-btn');
                            btn.textContent = '✅ ¡Copiado!';
                            btn.style.background = '#2e7d32';
                            setTimeout(() => {
                                btn.textContent = '📋 Copiar código';
                                btn.style.background = '#1976d2';
                            }, 2000);
                        });
                    }
                </script>
            </body>
            </html>
        `);

        console.log('\n' + '='.repeat(50));
        console.log('📋 CÓDIGO PARA WHATSAPP:');
        console.log(code);
        console.log('='.repeat(50) + '\n');

        return;
    }

    res.send("❌ No se recibió código de autorización.");
});

// Ruta base
app.get('/', (req, res) => {
    const fullUrl = `${req.protocol}://${req.get('host')}/oauth2callback`;

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Servidor OAuth - Google Calendar Bot</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
                .info { background: #e3f2fd; padding: 15px; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>🤖 Servidor OAuth - WhatsApp Bot</h1>
            <div class="info">
                <p>✅ El servidor está funcionando correctamente</p>
                <p>🔗 Callback URL: <code>${fullUrl}</code></p>
                <p>📱 Usa este URL en Google Cloud API</p>
            </div>
        </body>
        </html>
    `);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`🌐 Servidor OAuth iniciado en puerto ${port}`);
});
