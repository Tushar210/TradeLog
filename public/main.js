let a=document.getElementById("pl")
console.log(a)
if(a.innerHTML=="Profit"){
    a.style.color="white";
    a.style.backgroundColor="green";
}
if(a.innerHTML=="Loss"){
    a.style.color="white";
    a.style.backgroundColor=rgb(128, 0, 0);
}