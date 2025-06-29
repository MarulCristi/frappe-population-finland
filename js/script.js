const submitButton = document.getElementById("submit-data")
const jsonQuery = 
{
  "query": [
    {
      "code": "Vuosi",
      "selection": {
        "filter": "item",
        "values": [
          "2000", "2001", "2002", "2003", "2004",
          "2005", "2006", "2007", "2008", "2009",
          "2010", "2011", "2012", "2013", "2014",
          "2015", "2016", "2017", "2018", "2019",
          "2020", "2021"
        ]
      }
    },
    {
      "code": "Alue",
      "selection": {
        "filter": "item",
        "values": ["SSS"]
      }
    },
    {
      "code": "Tiedot",
      "selection": {
        "filter": "item",
        "values": ["vaesto"]
      }
    }
  ],
  "response": {
    "format": "json-stat2"
  }
}


const getData = async() => {
    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

    const res = await fetch(url, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonQuery)
    })
    if(!res.ok) {
        return;
    }
    const data = await res.json()

    return data


}

const checkAreaCode = async() => {

    const chosenArea = document.getElementById("input-area").value

    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"
    const res = await fetch(url);
    const data = await res.json();

    const areaCodes = data.variables[1].values
    const areaNames = data.variables[1].valueTexts

    let foundAreaCode = null;

    for(let i = 0; i < areaCodes.length; i++) {
        if (areaNames[i].toUpperCase() === chosenArea.toUpperCase()) {
            foundAreaCode = areaCodes[i];
            console.log(`${chosenArea} found with code ${foundAreaCode}!`);
            break;
        }
    }

    if(foundAreaCode) {
        jsonQuery.query[1].selection.values = [foundAreaCode]
        buildChart();
    }
    else {
        console.log(`${chosenArea} not found!`)
    }

}

function getChosenArea() {
    if(document.getElementById("input-area").value) {
        return `${document.getElementById("input-area").value.charAt(0).toUpperCase()}${document.getElementById("input-area").value.slice(1)}`;
    }
    return "Finland"
}

const buildChart = async() => {

    const data = await getData()

    const years = Object.values(data.dimension.Vuosi.category.label)
    const values = data.value

    // console.log(years);
    // console.log(values);


    const chartData = {
        labels: years,
        datasets: [
            {
                name: `Population in ${getChosenArea()}`, 
                values: values


            }
        ]
    }

    const chart = new frappe.Chart("#chart", {
        title: `Population in ${getChosenArea()}`,
        data: chartData,
        height: 450,
        type: "line",
        colors: ['#eb5146'],
        axisOptions: {
            xAxis: {
                min: 2000,
                max: 2021
            }
        }

    })
}

buildChart();


submitButton.addEventListener("click", function(event){
    event.preventDefault();
    checkAreaCode();
})