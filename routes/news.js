const {Router} = require('express');
const router = Router();
const db = require('../index');

router.get('/', async(req,res) => {

    const news = []

    await db.db.query('SELECT news_link, news_title, news_date, news_img FROM public.news', (err, data) => {
        if (err) {
            throw new Error(err);
        }
        data.rows.map(item => news.push(item));
        news.sort((a,b) => new Date(b.news_date) - new Date(a.news_date));
        console.log(news)
    });
    
    res.render('news',{
        news
    })

})

router.get('/keyword', async(req,res) => {
    const news = []
    let keyword = req.query.keyword;

    await db.db.query(`SELECT news_link, news_title, news_date, news_img FROM public.news WHERE news_title SIMILAR TO '_*${keyword}_*'`, (err, data) => {
        if (err) {
            throw new Error(err);
        }
        data.rows.map(item => news.push(item));
        news.sort((a,b) => new Date(b.news_date) - new Date(a.news_date));
        console.log(news)
    });
    
    res.render('news',{
        news
    })
})

module.exports = router;