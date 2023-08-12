import { readFileSync } from "fs";
import puppeteer from "puppeteer";
import eventRepository from "../../repositories/event-repository";
import dayjs from "dayjs";
import enrollmentRepository from "../../repositories/enrollment-repository";
import { notEnoughActivitiesError, notFoundError } from "../../errors";
import ticketRepository from "../../repositories/ticket-repository";
import activityRepository from "../../repositories/activity-repository";

type generateHtmlType = {
  userName: string;
  cpf: string;
  eventName: string;
  type: string;
  eventInitDate: string;
  eventEndDate: string;
};

function generateHtml(data: generateHtmlType) {
  const { userName, cpf, eventName, type, eventInitDate, eventEndDate } = data;
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
        * {
            box-sizing: border-box;
            padding: 0;
            border: 0;
        }
        
        body {
            width: 1200px;
            height: 840px;
            margin: 0;
            display: flex;
            padding: 0px;
        }
        
        html {
            -webkit-print-color-adjust: exact;
        }

        .bar {
            width: 10%;
            heigth: 100%;
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
            -webkit-print-color-adjust: exact;
            background-color: #DDDDDD;
        }

        .certified-container {
            width: 90%;
            padding-left: 5%;
            padding-right: 5%;
            background-color: #ffffff;
            display: flex;
            gap: 18px;
            flex-direction: column;
            align-items: center;
        }

        h1 {
            margin-top: 10%;
            color: #000;
            font-family: Roboto;
            font-size: 80px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }

        p {
            color: #000;
            font-family: Roboto;
            font-size: 28px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }

        h2 {
            color: #000;
            font-family: Roboto;
            font-size: 40px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
        }
        img {
            margin-top: 10px;
            width: 120px;
        }
        </style>
    </head>
    
    <body>
        <div class="bar"></div>
        <div class="certified-container">
            <h1>CERTIFICADO</h1>
            <p>Certificamos, para todos os devidos fins, de que a(o):</p>
            <h2>${userName}</h2>
            <p>Com documento ${cpf} participou do evento ${eventName}, de forma
                ${type}, entre os dias ${eventInitDate} e ${eventEndDate}.</p>
            <img src="data:image/jpeg;base64,${readFileSync("./src/assets/drivenlogo.png").toString("base64")}" alt="">
        </div>
    </body>
    
    </html>`;
}

async function generateCertificate(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();
  const { id: enrollmentId, name, cpf } = enrollment;

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollmentId);
  if (!ticket) throw notFoundError();
  let type = "";
  if (ticket.TicketType.isRemote) {
    type = "remota";
  } else {
    const activitiesCount = await activityRepository.getActivitiesCountByUserId(userId);
    if (activitiesCount < 5) throw notEnoughActivitiesError();
    type = "presencial";
  }

  const { title, startsAt, endsAt } = await eventRepository.findFirst();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const userData: generateHtmlType = {
    userName: name,
    cpf: cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3.$4"),
    eventName: title,
    type: type,
    eventInitDate: dayjs(startsAt).format("DD/MM/YYYY"),
    eventEndDate: dayjs(endsAt).format("DD/MM/YYYY"),
  };

  const htmlContent = generateHtml(userData);

  await page.setContent(htmlContent);
  await page.setViewport({ width: 842, height: 595, isLandscape: true });

  const certificate = await page.pdf({ path: "certificado.pdf", format: "A4", landscape: true });

  await browser.close();

  return certificate;
}

const certificateService = {
  generateCertificate,
};

export default certificateService;
