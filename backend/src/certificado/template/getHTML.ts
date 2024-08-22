export const getHTML = ({
    eventname,
    username,
    dtStart,
    qtdHours,
    dtEnd,
    qrCode,
    createdAt,
    key,
    url,
  }) => `
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Certificado</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">

    <style>
      body {
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Montserrat', sans-serif;
        background-image: url('${url}');
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }

      h1, span, p {
        font-size: 14px;
        color: #313131;
        text-align: justify;
      }

      .texto {
        width: 700px;
        max-height: 130px;
        font-size: 18px;
      }

      .qr-code {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }

      .qr-code img {
        width: 100px;
        height: 100px;
        border: 2px solid #313131;
        border-radius: 10px;
      }

      footer {
        position: fixed;
        bottom: 40px;
        text-align: center;
        margin-left: 10%;
        width: 100%;
        color: #313131;
        font-size: 8px;
      }
    </style>
  </head>
  <body>
    <div>
      <p class="texto">
        Certificamos que <strong>${username}</strong> participou do evento
        <strong>${eventname}</strong> que aconteceu no período de
        <strong>${dtStart}</strong> a <strong>${dtEnd}</strong> com carga horária de
        <strong>${qtdHours}</strong> horas.
      </p>

      <p style="display: flex; justify-content: space-between">
        <span>Emitido em: <strong>${createdAt}</strong></span>
        <span>Chave: <strong>${key}</strong></span>
      </p>

      <!-- Adicionando a imagem do QR Code -->
      <div class="qr-code">
        ${qrCode}
      </div>
    </div>

    <footer>
      <p>Acesse o site /validar-certificado para verificar se esse certificado é válido.</p>
    </footer>
  </body>
</html>
    `;