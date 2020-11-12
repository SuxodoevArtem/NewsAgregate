const {Router} = require('express');
const router = Router();
const db = require('../index');
const Parser = require('../parser');

router.get('/', async(req,res) => {

    rssCanels = []

    await db.db.query(`SELECT public.rsschannels.rsschannels_id,public.rsschannels.rsschannels_link, COUNT(public.news.news_rsschannels_id) AS num_news 
                FROM public.rsschannels
                        LEFT JOIN public.news 
                            ON rsschannels.rsschannels_id = news.news_rsschannels_id
                GROUP BY public.rsschannels.rsschannels_id `, (err, data) => {
        if (err) {
            console.log(err.detail);
        }
        data.rows.map(item => rssCanels.push(item));
        console.log(rssCanels)
    });

    res.render('settings',{
        rssCanels
    })

})

router.post('/add', async(req,res) => {

    db.db.query(`INSERT INTO public.rsschannels( rsschannels_link) VALUES ('${req.body.url}')`, (err, data) => {
        if (err) {
            console.log(err.detail);
        }else{
            Parser.Parser();
            res.redirect('/settings')
        }
    });

})

router.post('/remove', async(req, res) => {
    console.log(req.body.id)
    await db.db.query(`DELETE FROM public.rsschannels WHERE rsschannels_id = '${req.body.id}';`, (err, data) => {
        if (err) {
            console.log(err.detail);
        }else{
            res.redirect('/settings')
        }
    });
})

module.exports = router;