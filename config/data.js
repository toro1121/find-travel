export default {
    company: [{
        name: "lion",
        cname: "雄獅",
        url: "http://www.liontravel.com/webpd/webpdse01.aspx?sFdate={start_date}&sTdate={end_date}&sCity={city}&sTravel={area1}&sWebarea={area}",
        city: {
            "台北": "TPE",
            "台中": "TCH",
            "高雄": "KHH"
        },
        area: {
            "北海道": "A7",
            "東北": "A6",
            "東京": "A1",
            "關西": "A2",
            "九州": "A5",
            "沖繩": "A4",
        }
    }, {
        name: "star",
        cname: "燦星",
        url: "http://www.startravel.com.tw/StarTravel.Web.IGRP.Prod.V2/Search_GROUP.aspx?SD={start_date}&ED={end_date}&cf={city}&CityFrom_DL2={city}&P2={area}&TravelLine_DL={area}",
        city: {
            "台北": "TPE",
            "台中": "TXG",
            "高雄": "KHH"
        },
        area: {
            "北海道": "JP01",
            "東北": "JP02",
            "東京": "JP03",
            "關西": "JP05",
            "九州": "JP07",
            "沖繩": "JP08",
        }
    }, {
        name: "coke",
        cname: "可樂",
        url: "http://www.colatour.com.tw/C10A_TourSell/C10A02_TourQuery.aspx?StartTourDate={start_date}&EndTourDate={end_date}&DepartureCity={city}&RegionCode={area}",
        city: {
            "台北": "台北",
            "台中": "台中",
            "高雄": "高雄"
        },
        area: {
            "北海道": "A-01",
            "東北": "A-05",
            "東京": "A-02",
            "關西": "A-03",
            "九州": "A-06",
            "沖繩": "A-07",
        }
    }, {
        name: "eztravel",
        cname: "ezTravel",
        url: "http://vacation.eztravel.com.tw/pkgfrn/results/{city}/{area}?depDateFrom={start_date}&depDateTo={end_date}",
        city: {
            "台北": "TPE",
            "台中": "TXG",
            "高雄": "KHH"
        },
        area: {
            "北海道": "48",
            "東北": "70",
            "東京": "93",
            "關西": "94",
            "九州": "41",
            "沖繩": "80",
        }
    }],
    city: ["台北", "台中", "高雄"],
    area: {
        "日本": ["北海道", "東北", "東京", "關西", "九州", "沖繩"],
        // "韓國": []
    }
};
