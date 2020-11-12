const db = require('./index');
const rssParser = require('rss-parser');

/*Парсинг только RSS каналов*/
//https://vesti-perm.ru/vesti_perm.rss ):
//https://www.permkrai.ru/bitrix/rss.php?ID=&LANG=s1&TYPE=news&LIMIT=7000 (:
//http://static.feed.rbc.ru/rbc/logical/footer/news.rss ):
//https://59.ru/text/?page=${i}&rubric=education ):

module.exports.Parser = async function Parsing(){
    
    let rss = [];
    let massNews = [];
    let parser = new rssParser();


    db.db.query('SELECT rsschannels_id, rsschannels_link FROM public.rsschannels', async (err, data) => {
        if (err) {
            throw new Error(err);
        }
        
        data.rows.map(item => rss.push(item));
        rss.map(item => console.log(item.rsschannels_id + ' ' + item.rsschannels_link))

        for(let n of rss){

            if(n.rsschannels_link){
                let feed = await parser.parseURL(n.rsschannels_link);
                feed.items.forEach(item => {
                    if(item.content.match(/Пермским\sгосударственным\sаграрно-технологическим\sуниверситетом|Пермского\sгосударственного\sаграрно-технологического\sуниверситета|Пермский\sгосударственный\sаграрно-технологический\sуниверситет/gi)){
                        massNews.push({
                            news_link: item.link,
                            news_rsschannels_id: n.rsschannels_id,
                            news_title: item.title,
                            news_date: item.isoDate,
                            news_img: item.enclosure.url || 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg'
                        })
                    }
                });
            }
        }
        
        for(let n of massNews){
            db.db.query(`INSERT INTO public.news( news_link, news_rsschannels_id, news_title, news_date, news_img)
            VALUES ( '${n.news_link}', '${n.news_rsschannels_id}', '${n.news_title}', '${n.news_date}', '${n.news_img}');` , (err,data) => {
                if (err) {
                    console.log(err.detail)
                }
                console.log(data)
            })
        }

    });
}


