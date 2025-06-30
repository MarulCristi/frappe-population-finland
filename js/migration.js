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


const initializeFromStorage = () => {
    const savedMunicipality = localStorage.getItem('selectedMunicipality');
    const savedCode = localStorage.getItem('selectedMunicipalityCode');
    
    if(savedMunicipality && savedCode) {
        jsonQuery.query[1].selection.values = [savedCode];
        if(document.getElementById("input-area")) {
            document.getElementById("input-area").value = savedMunicipality;
        }
    }
}

function getChosenArea() {
    const inputElement = document.getElementById("input-area");
    if(inputElement && inputElement.value) {
        return inputElement.value;
    } else if(localStorage.getItem('selectedMunicipality')) {
        return localStorage.getItem('selectedMunicipality');
    }
    return "Finland";
}

const buildBirthDeathChart = async() => {

    jsonQuery.query[2].selection.values = ["vm41", "vm42"] // immigration and emigration
    const data = await getData()

    console.log(data)

    const years = Object.values(data.dimension.Vuosi.category.label)
    const values = data.value

    const immigration = [];
    const emigration = [];

    for (let i = 0; i < values.length; i += 2) {
        immigration.push(values[i]);    
        emigration.push(values[i + 1]);
    }

    // console.log("Years:", years);
    // console.log("Marriages:", marriages);
    // console.log("Divorces:", divorces);

    const chartData = {
        labels: years,
        datasets: [
            {
                name: "Immigration", 
                values: immigration,
            },
            {
                name: "Emigration",
                values: emigration,
            }
        ]
    }

    const chart = new frappe.Chart("#chart", {
        title: `Immigration and Emigration in ${getChosenArea()}`,
        data: chartData,
        height: 450,
        type: "bar",
        colors: ['#63d0ff', '#363636'],
        axisOptions: {
            xAxis: {
                min: 2000,
                max: 2021
            }
        }
    });
}

initializeFromStorage();
buildBirthDeathChart();