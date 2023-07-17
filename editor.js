const input_img=document.querySelector(".input-img"),
choose_imgBtn=document.querySelector('.choose-img-btn'),
save_mgBtn=document.querySelector('.save-img-btn');

let preview_img=document.querySelector(".preview-img img"),
filter_options=document.querySelectorAll(".filter button"),
rotate_options=document.querySelectorAll(".rotate-flip button");

const filter_name=document.querySelector(".filter-info .name"),
filter_value=document.querySelector(".filter-info .value"),
filter_slider=document.querySelector(".slider input"),
reset_filterBtn=document.querySelector(".reset-filter");

let brightness=100, saturation=100, inversion=0, grayscale=0, rotate=0, flip_horizontal=1, flip_vertical=1;


const apply_filter=()=>{
    preview_img.style.transform=`rotate(${rotate}deg) scale(${flip_horizontal}, ${flip_vertical})`;
    preview_img.style.filter=
    `brightness(${brightness}%)
     saturate(${saturation}%)
     invert(${inversion}%)
     grayscale(${grayscale}%)
    `;
}


const load_image=()=>{
    let file=input_img.files[0];                        //getting user selected file
    if(!file) return;                                   //return if user has not selected file
    preview_img.src=URL.createObjectURL(file);          //passing file url as preview img src
    preview_img.addEventListener("load", ()=>{
        reset_filterBtn.click();
        document.querySelector(".container").classList.remove("disable")
    })
}


filter_options.forEach(option=>{
    option.addEventListener("click", ()=>{                  //adding a click event listener to all filter buttons
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filter_name.innerText=option.innerText;

        if(option.id === "brightness"){
            filter_slider.max=200;
            filter_slider.value=brightness;
            filter_value.innerText=`${brightness}%`;
        }else if(option.id==="saturation"){
            filter_slider.max=200;
            filter_slider.value=saturation;
            filter_value.innerText=`${saturation}%`;
        }else if(option.id==="inversion"){
            filter_slider.max=100;
            filter_slider.value=inversion;
            filter_value.innerText=`${inversion}%`;
        }else{
            filter_slider.max=100;
            filter_slider.value=grayscale;
            filter_value.innerText=`${grayscale}%`;
        }
    })
})


const update_filter=()=>{
    filter_value.innerText=`${filter_slider.value}%`;
    const selected_filter=document.querySelector('.filter .active'); 
    if(selected_filter.id==="brightness"){
        brightness=filter_slider.value;
    }else if(selected_filter.id==="saturation"){
        saturation=filter_slider.value;
    }else if(selected_filter.id==="inversion"){
        inversion=filter_slider.value;
    }else{
        grayscale=filter_slider.value;
    }
    apply_filter();
}


rotate_options.forEach(option=>{
    option.addEventListener("click", ()=>{      //adding click event listener to all rotate button
        if(option.id==="left"){
            rotate -=90;                        //if clicked btn is left-rotate, decrement rotate value by -90
        }else if(option.id==="right"){
            rotate +=90;                        //if clicked btn is right-rotate, increment rotate value by -90
        }else if(option.id==="horizontal"){
            flip_horizontal= flip_horizontal===1 ? -1 :1;
        }else{
            flip_vertical= flip_vertical===1 ? -1 :1;
        }
        apply_filter();
    });
})


const reset_filter=()=>{        //reset all variables to its default value
    brightness=100;
    saturation=100;
    inversion=0; 
    grayscale=0;
    rotate=0; 
    flip_horizontal=1;
    flip_vertical=1;
    filter_options[0].click();      //clicking brightness btn so that brightness selected by default
    apply_filter();
}


const save_image=()=>{
    const canvas=document.createElement("canvas");      //It will create a canvas element
    const ctx= canvas.getContext("2d");     //It will returns a drawing context on the canvas
    canvas.width= preview_img.naturalWidth;
    canvas.height= preview_img.naturalHeight;
    ctx.filter=
    `brightness(${brightness}%)
    saturate(${saturation}%)
    invert(${inversion}%)
    grayscale(${grayscale}%)
   `;
   ctx.translate(canvas.width/2, canvas.height/2);
   if(rotate !== 0){
    ctx.rotate(rotate*Math.PI/180)
   }
    ctx.scale(flip_horizontal,flip_vertical);
    ctx.drawImage(preview_img, -canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

    const link=document.createElement("a");
    link.download="image.jpg";
    link.href=canvas.toDataURL();
    link.click();//to download
}


input_img.addEventListener("change", load_image);
filter_slider.addEventListener("input", update_filter);
reset_filterBtn.addEventListener("click", reset_filter);
save_mgBtn.addEventListener("click", save_image);
choose_imgBtn.addEventListener("click", ()=>input_img.click());
