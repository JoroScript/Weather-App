const searchBar=document.querySelector('#searchBar');
const iconImg=document.querySelector('#iconImg');
const cityName=document.querySelector('#cityName')
const currDate=document.querySelector('#currDate');
const currTemp=document.querySelector('#currTemp');
const currConds=document.querySelector('#currConds')
const humidity=document.querySelector('#humidity');
const feelsLike=document.querySelector('#feelsLike');
const windSpeed=document.querySelector('#wind');
const metricsDiv=document.querySelector('#metricsDiv');
const scrollerDiv=document.querySelector('#scroller');
const options=document.querySelector('#options');
const todayBtn=document.querySelector('#today');
const tomorrowBtn=document.querySelector('#tomorrow');
const nextDays=document.querySelector('#nextDays');
const container=document.querySelector('#container');
const loader=document.querySelector('.loader');
const first=document.querySelector('#first');
let populated=false;
let myData={}; 
let tempWithCelsius = `\u00B0C`; // Using template literals
const DateToday = () =>{
    const today = new Date(Date.now());
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

todayBtn.addEventListener('click',()=>{
    if(populated===true){
        populateScroller(myData.today);
    }
})
tomorrowBtn.addEventListener('click',()=>{
    if(populated===true){
        populateScroller(myData.tomorrow);
    }
})
nextDays.addEventListener('click',()=>{
    if(populated===true){
        populateScroller(myData.nextDays)
    }
})




searchBar.addEventListener('keydown',(event)=>{
    if(event.key ==="Enter"){
        console.log("enter pressed");
        getCity(searchBar.value);
    }
})
function cutOffZero(str) {
    return str.charAt(0)==="0" ? str.substring(1) : str;
}
async function getCity(city){
    try {
        searchBar.value='';
    container.style.opacity='0';
    container.style.display='none';
        loader.style.display='block';
        first.style.display='none';

        let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=YPS5WXZVK5ENV2RWJV6FB2KFZ&contentType=json`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data= await response.json();
        loader.style.display='none';
        first.style.display='flex';
        console.log(data);
        myData.temp=data.currentConditions.temp;
        myData.cityName=data.resolvedAddress
        myData.conditions=data.currentConditions.conditions;
        myData.iconUrl=`icons/${data.currentConditions.icon}.svg`;
        myData.feelsLike=data.currentConditions.feelslike;
        myData.humidity=data.currentConditions.humidity;
        myData.windSpeed=data.currentConditions.windspeed;
        myData.today=data.days[0].hours;
        myData.tomorrow=data.days[1].hours;
        myData.nextDays=data.days.filter((__,index)=> index>0 && index<8)
       populateData();
        // console.log(iconImg.src);
    } catch (error) {
        console.error('error fetching the city weather data:',error);
    }
   
    
}


const populateData = () =>{
    populated=true;
    metricsDiv.style.display="flex";
    cityName.textContent=myData.cityName;
    currDate.textContent=DateToday();
    iconImg.src=myData.iconUrl;
    iconImg.style.display="block";
    options.style.display='block';
    container.style.display='flex';
    container.style.border='3px solid white';


    setTimeout(() => {
    container.style.opacity='1';
    }, 100);
    currTemp.innerHTML=`${myData.temp}<span>${tempWithCelsius}</span>`;
    currConds.innerHTML=`Conditions: <span>${myData.conditions}</span>`;
    humidity.innerHTML=`Humidity: <span>${myData.humidity} %</span>`;
    feelsLike.innerHTML=`Feels Like: <span>${myData.feelsLike} ${tempWithCelsius}</span>`;
    windSpeed.innerHTML=`Wind: <span>${myData.windSpeed} m/s </span>`;
    // myData.today.forEach(hour => {
    //     console.log(hour.datetime);
    //     let child=document.createElement('div');
    //     child.className='child';
    //     let hourP=document.createElement('p');
    //     hourP.textContent=cutOffZero(hour.datetime);
    //     let divImg=document.createElement('div');
    //     divImg.className='imgHolder';
    //     divImg.style.backgroundImage=`url('icons/${hour.icon}.svg')`;
    //     let hourTemp=document.createElement('p');
    //     hourTemp.className='temp';
    //     hourTemp.innerHTML=`${hour.temp}<span>${tempWithCelsius}</span>`;
    //     child.appendChild(hourP);
    //     child.appendChild(divImg);
    //     child.appendChild(hourTemp);
    //     scrollerDiv.appendChild(child);
    // });
    populateScroller(myData.today);
}
const populateScroller = (date)=>{
    scrollerDiv.innerHTML='';
    date.forEach(hour => {
        let child=document.createElement('div');
        child.className='child';
        let hourP=document.createElement('p');
        hourP.textContent=cutOffZero(hour.datetime);
        let divImg=document.createElement('div');
        divImg.className='imgHolder';
        divImg.style.backgroundImage=`url('icons/${hour.icon}.svg')`;
        let hourTemp=document.createElement('p');
        hourTemp.className='temp';
        hourTemp.innerHTML=`${hour.temp}<span>${tempWithCelsius}</span>`;
        child.appendChild(hourP);
        child.appendChild(divImg);
        child.appendChild(hourTemp);
        scrollerDiv.appendChild(child);
    });
}