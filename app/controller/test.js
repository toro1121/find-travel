import cheerio from "cheerio";
import phantom from "phantom";

import config from "../../config/data";

class Test {
    constructor() {
        this.index = this.index.bind(this);
    }
    index(req, res, next) {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let date = new Date();
        date = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
        console.log();
        console.log(date + " client ip is ( " + ip + " )");
        console.log();

        if (typeof req.query.city == "undefined") {
            return res.sendStatus(404);
        }

        let q = req.query;
        let query = [q.date[0], q.date[1], q.city, q.area];
        // let query = ["2016-07-31", "2016-07-31", "台北", "北海道"];
        let url, sdate, edate, city, area;
        let data = [];
        let tmp = [];

        for (var key in config.company) {
            let company = config.company[key];

            url = company.url;

            // params
            for (var k in query) {
                switch (k) {
                    case "0":
                        sdate = company.name != "coke" ? query[k].replace(/\//g, "") : query[k];
                        url = url.replace(/\{start\_date\}/g, sdate);
                        break;
                    case "1":
                        edate = company.name != "coke" ? query[k].replace(/\//g, "") : query[k];
                        url = url.replace(/\{end\_date\}/g, edate);
                        break;
                    case "2":
                        city = company.city[query[k]];
                        url = url.replace(/\{city\}/g, city);
                        break;
                    case "3":
                        area = company.area[query[k]];
                        url = url.replace(/\{area\}/g, area);
                        break;
                    default:
                }
            }
            if (company.name == "lion") {
                url = url.replace(/\{area1\}/, area[0]);
            }

            let k = key;
            tmp[k] = {};
            tmp[k].url = url;

            phantom.create().then(ph => {
                tmp[k].ph = ph;
                return tmp[k].ph.createPage();
            }).then(page => {
                tmp[k].page = page;
                return tmp[k].page.open(tmp[k].url);
            }).then(status => {
                return tmp[k].page.property("content")
            }).then(content => {
                data.push({
                    name: company.name,
                    body: content
                });
                tmp[k].page.close();
                tmp[k].ph.exit();
            });
        }

        let d = [];
        let bool = 0;
        let returnData = () => {
            console.log(data.length);
            if (bool) {
                return res.json({
                    success: true,
                    message: null,
                    data: d
                });
            }
            if (data.length == 4) {
                for (var key in data) {
                    d = d.concat(this.parseHtml(data[key].name, data[key].body));
                    if (key == tmp.length - 1) {
                        bool = 1;
                    }
                }
            }
            setTimeout(() => {
                returnData()
            }, 1000);
        }

        returnData();
    }
    convertDate(date) {
        if (!date.length) {
            return date;
        }

        date = date.replace(/[^0-9]/g, "");
        if (date.length > 7) {
            date = date.slice(4);
        }
        return date.substr(0, 2) + "/" + date.substr(2, 2);
    }
    parseHtml(type, body) {
        let $ = cheerio.load(body);
        let data = [];

        switch (type) {
            case "lion":
                $(".contentList table tr").not(".listTitle").each((i, e) => {
                    let d = new Date();
                    let id = i + "-" + d.getTime();

                    data.push({
                        id: id,
                        company: "雄獅",
                        date: this.convertDate($(e).find(".time").text()),
                        name: $(e).find(".productnName").text(),
                        day: $(e).find(".day").text(),
                        price: $(e).find(".price").text().replace(/[^0-9]/g, ""),
                        link: "http://www.liontravel.com/webpd/" + $(e).find(".productnName a").attr("href")
                    });
                });
                break;
            case "star":
                $("#Searchend1_tb1 table table tr").each((i, e) => {
                    if (i) {
                        let d = new Date();
                        let id = i + "-" + d.getTime();

                        data.push({
                            id: id,
                            company: "燦星",
                            date: this.convertDate($(e).find("td").eq(0).text()),
                            name: $(e).find("td").eq(1).text(),
                            day: $(e).find("td").eq(3).text().replace(/[^0-9]/g, ""),
                            price: $(e).find("td").eq(4).text().replace(/[^0-9]/g, ""),
                            link: $(e).find("a").attr("href").replace(/javascript\:opensamwindows\(\'/, "").replace(/\'\)/, "")
                        });
                    }
                });
                break;
            case "coke":
                $("#Grid_Group tr.GridItem").each((i, e) => {
                    let d = new Date();
                    let id = i + "-" + d.getTime();

                    data.push({
                        id: id,
                        company: "可樂",
                        date: this.convertDate($(e).find("td").eq(1).text()),
                        name: $(e).find(".TourName").text(),
                        day: "",
                        price: $(e).find("td").eq(5).text().replace(/[^0-9]/g, ""),
                        link: "http://www.colatour.com.tw" + $(e).find(".TourName").attr("href")
                    });
                });
                break;
            case "eztravel":
                $(".list-box.mainLinkBox").each((i, e) => {
                    let d = new Date();
                    let id = i + "-" + d.getTime();

                    data.push({
                        id: id,
                        company: "ezTravel",
                        date: this.convertDate($(e).find(".start-date span").eq(0).text()),
                        name: $(e).find(".prod-title").text(),
                        day: $(e).find(".travel-days").text().replace(/[^0-9]/g, ""),
                        price: $(e).find(".text-price").text().replace(/[^0-9]/g, ""),
                        link: "http://vacation.eztravel.com.tw" + $(e).data("href").replace(/http\:\/\/vacation.\eztravel\.com\.tw/, "")
                    });
                });
                break;
        }

        return data;
    }
}

export default new Test();
