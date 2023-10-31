var express = require('express');
var router = express.Router();
var web3Util = require('../helpers/web3Util');
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
const fs = require('fs');
const crypto = require('crypto');

function formatDate(date, format) {
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yy|yyy/gi, matched => map[matched])
}

function calculateSHA256(pdfBytes) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(pdfBytes);
    return sha256.digest('hex');
}

router.post('/', async (req, res) => {
    const score = req.body.score || 0;
    const rollNumber = req.body.rollNumber || ' ';

    const certifiedTo = req.body.certifiedTo;
    const certifiedDate = formatDate((new Date()), "dd/mm/yy") ;
    const certifiedBy = "Klaytn Foundation";
    const certifiedToInfo = `Roll No: ${rollNumber} | Score : ${score}%`;

    const pdfPath = './template.pdf';
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const [firstPage] = pdfDoc.getPages();
    const fontStyle1 = await pdfDoc.embedFont(StandardFonts.Courier)
    const { width, height } = firstPage.getSize()

    firstPage.drawText(certifiedTo, {
      x: 180,
      y: height-360,
      size: 30,
      font: fontStyle1,
      color: rgb(0, 0.53, 0.71),
    });

    firstPage.drawText(certifiedToInfo, {
        x: 150,
        y: height-490,
        size: 14,
        font: fontStyle1,
        color: rgb(0, 0.53, 0.71),
    });

    firstPage.drawText(certifiedDate, {
        x: 80,
        y: height-550,
        size: 20,
        font: fontStyle1,
        color: rgb(0, 0.53, 0.71),
    });

    firstPage.drawText(certifiedBy, {
        x: 370,
        y: height-550,
        size: 14,
        font: fontStyle1,
        color: rgb(0, 0.53, 0.71),
    });

    const pdfBytes = await pdfDoc.save()
    const sha256Hash = calculateSHA256(pdfBytes);

    fs.writeFileSync(`./public/${sha256Hash}.pdf`, pdfBytes);
    let transactionHash = await web3Util.registerCertificate(certifiedTo, rollNumber, score, certifiedBy, sha256Hash, true);
    return res.status(200).json({success: true, message: 'Registered the Certificate Successfully!', data: { file: `${sha256Hash}.pdf`, transactionHash: transactionHash }})
});

router.post('/verify', async (req, res) => {
    const certificateHash = req.body.certificateHash || '';
    let eventData = await web3Util.verifyCertificate(certificateHash);
    return res.status(200).json({success: true, data: { eventData: eventData }})
});

module.exports = router;