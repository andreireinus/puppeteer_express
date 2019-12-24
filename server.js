const puppeteer = require('puppeteer');
const app = require('express')()

// Url encoding
app.use( require('body-parser').urlencoded() ); 

const auth = {
    login: process.env.AUTH_LOGIN, 
    password: process.env.AUTH_PASSWORD
} 

if (auth.login) {
    app.use((req, res, next) => {
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    
        if (login && password && login === auth.login && password === auth.password) {
            return next();
        }

        res.status(401).send({'status': 'Unauthorized'});
    });
}

app.get('/health', (req, res) => {
    res.status(200).send({'status': 'Healthy'});
});


const pdfOptions = {
    format: 'A4'
};

app.post('/pdf', (req, res) => {
    var html = req.body.html;

    (async () => {
        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        await page.setContent(html, {
            waitUntil: "networkidle2"
        });

        var pdfBuffer = await page.pdf(pdfOptions);
        await browser.close();

        res.send(pdfBuffer);
    })();
});

app.listen(process.env.PORT || 80)