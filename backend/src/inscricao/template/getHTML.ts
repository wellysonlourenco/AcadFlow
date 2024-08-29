export const getHTML = ({
  eventname,
  username,
  dataInsc,
  local,
    numeroInscricao,
  qrCode
}) => `
  <html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprovante de Inscrição</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }

        .comprovante {
            background-color: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            margin: auto;
        }

        .comprovante h1 {
            text-align: center;
            color: #333;
            margin-bottom: 20px;
        }

        .comprovante p {
            margin: 10px 0;
            color: #666;
        }

        .qr-code {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }

        .qr-code img {
            width: 150px;
            height: 150px;
            border: 2px solid #333;
            border-radius: 10px;
        }

        .evento-info {
            text-align: center;
            margin-top: 30px;
        }

        @media print {
            body {
                margin: 30px 0px 0px 0px;
                padding: 0;
                width: 210mm;
                height: 297mm;
            }

            .comprovante {
                max-width: 100%;
                box-shadow: none;
                border-radius: 0;
                padding: 30mm 20mm;
            }
        }
    </style>
</head>
<body>
    <div class="comprovante">
        <h1>Comprovante de Inscrição</h1>
        <p><strong>Nome do Participante:</strong> ${username}</p>
        <p><strong>Evento:</strong> ${eventname}</p>
        <p><strong>Data:</strong> ${dataInsc}</p>
        <p><strong>Local:</strong> ${local}</p>
        <p><strong>Número de Inscrição:</strong> ${numeroInscricao}</p>

        <div class="qr-code">
            ${qrCode}
        </div>

        <div class="evento-info">
            <p>Apresente este comprovante na entrada do evento.</p>
        </div>
    </div>
</body>
</html>
    `;