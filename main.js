const menu = document.getElementById('card');
const game_start = document.getElementById('play');
const background = document.getElementById('custom-color-picker');
const logo = document.getElementById('draggable');

const gradient_1 = document.getElementById('gradient-1');
const gradient_2 = document.getElementById('gradient-2');

let timer = document.getElementById('timer');
let show_time = document.getElementById('show-time');

let dps = document.getElementById('dps');

let in_game_timer = timer.value;

let color_1 = document.getElementById('color-1');
let color_2 = document.getElementById('color-2');
let color_3 = document.getElementById('color-3');

let points = 0;
let local_points = points;
let show_points = document.getElementById('show-points');

/* playable time value change on input */

timer.addEventListener('input', () => {
    in_game_timer = timer.value;
})

/* change gradient  */

gradient_1.addEventListener('input', () => {

    document.body.style.backgroundImage = 
    `linear-gradient(to left, ${gradient_1.value}, ${gradient_2.value}, ${gradient_1.value})`;
    logo.style.color = gradient_1.value;
})

gradient_2.addEventListener('input', () => {
    
    document.body.style.backgroundImage = 
    `linear-gradient(to left, ${gradient_1.value}, ${gradient_2.value}, ${gradient_1.value})`;
    logo.style.color = gradient_1.value;

})

/* get bg color from local storage or else create one */

let current_glocal_color = null;

if (localStorage.getItem('local_bg')) {

    let current_bg = localStorage.getItem('local_bg');
        document.body.style.backgroundColor = current_bg;
        logo.style.color = current_bg;
        background.setAttribute('value', current_bg);

        current_glocal_color = current_bg;

} else {

    let current_bg = background.value;
    document.body.style.backgroundColor = current_bg;
    logo.style.color = current_bg;
    localStorage.setItem('local_bg', current_bg);

    current_glocal_color = current_bg;

}

/* set one of recommended colors to local storage value */

function recommendedBg(recommended_color) {
    if (recommended_color == color_1) {
        recommended_color = '#4297A0';

    } else if (recommended_color == color_2) {
        recommended_color = '#F4EAE6';
    } else if (recommended_color == color_3) {
        recommended_color = '#E57F84';
    }

    localStorage.setItem('local_bg', recommended_color);
    document.body.style.backgroundColor = recommended_color;
    logo.style.color = recommended_color;

    current_glocal_color = recommended_color;
}

/* save background options to local storage value */

background.addEventListener('input', customBg);

function customBg() {
    localStorage.setItem('local_bg', background.value);
    document.body.style.backgroundColor = background.value;
    logo.style.color = background.value;
}

/* options closed, when start game button is clicked */

game_start.addEventListener('mouseup', () => {
    menu.style.transform = "translateY(200%)";
    requestAnimationFrame(starting);
})

function starting() {

    const counter = document.createElement('div');
    counter.classList.add('counter');
    counter.innerHTML = "0";
    document.body.appendChild(counter);
    
    let count = 3;
    const counting = setInterval(() => {
        
        counter.style.transform = "translate(-50%, -50%) scale(1)";
        counter.innerHTML = count;
        count--;
        local_points = 0;
        show_points.style.transform = "translateX(-50%) translateY(0)";
        show_time.innerHTML = `time: ${timer.value}`;
        show_time.style.transform = "translateX(-50%) translateY(0)";
        show_points.innerHTML = `points: ${local_points}`;
        dps.style.transform = "translateX(-50%) translateY(200%)";
        
        if (count < 0) {
            counter.style.transform = "translate(-50%, -50%) scale(0)";
            gameTimer()
            levelMaker();
            clearInterval(counting);
        }
    }, 1000);

    
}

/* level maker calls mechanics after creating levels untill time runs out */

function levelMaker() {
    
    const block = document.createElement('div');
    block.classList.add('block');
    block.setAttribute('id', 'block');
    block.setAttribute('draggable', 'true');
    document.body.appendChild(block);
    block.style.backgroundColor = current_glocal_color;
    block.style.filter = "invert(1)";

    const container = document.createElement('div');
    container.classList.add('container');
    container.setAttribute('id', 'container');
    document.body.appendChild(container);

    function blockPosition(element) {

        // by default max is 100
        let max = 300;
        // default min is 50
        let min = 50;

        let y_pos = `${Math.random() * (window.innerHeight + 1 - max) + min}px`;
        let x_pos = `${Math.random() * (window.innerWidth + 1 - max) + min}px`;

        element.style.top = y_pos;
        element.style.left = x_pos;

    }

    mechanics();

    blockPosition(block);
    blockPosition(container);


    const next_level = setTimeout(() => {
        // nextLevel();
        clearTimeout(next_level);
    }, 1000);

}

/* function, wchich defines the gameplay (elements behavior) */

function mechanics() {

    const block = document.getElementById('block');
    const container = document.getElementById('container');

    function handleMove() {

        block.addEventListener('drag', (e) => {

            block.style.top = `${e.clientY}px`;
            block.style.left = `${e.clientX}px`;
            document.body.style.cursor = "grab";        
        
        })  

        container.addEventListener('drop', (e) => {

            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            block.remove();
            container.remove();
            /* linijka na dole mi tak bardzo pomogła, że nie mam serca jej usuwać :( */
            // console.log('dropped' + local_points);
            local_points++;
            show_points.innerHTML = `points: ${local_points}`;

            levelMaker();

        })

        block.addEventListener('dragover',      e => e.preventDefault());
        container.addEventListener('dragover',  e => e.preventDefault());
        container.addEventListener('dragenter', e => e.preventDefault());
    }

    block.addEventListener('mousedown', handleMove);
}

/* 
    1. Gamer is showed, valid timer for settimeout is assigned
    2. Countdown starts (based on timer variable)
*/

function gameTimer() {
    
    show_time.style.transform = "translateX(-50%) translateY(0)";

    const countdown =  setInterval(() => {

        show_time.innerHTML = `czas: ${in_game_timer}`;
        in_game_timer--;

        if (in_game_timer < 0) {
            show_time.style.transform = "translateX(-50%) translateY(-1000%)";
            show_points.style.transform = "translateX(-50%) translateY(-1000%)";

            dps.innerHTML =
                `points per second: ${(local_points / timer.value).toFixed(3)}`;

            dps.style.transform = "translateX(-50%) translateY(0)";

            gameOver();
            in_game_timer = timer.value;
            clearInterval(countdown);
        }

    }, 1000);
    
}

/* en of the game (deleting non essencial elements and setting visuals) */

function gameOver() {

    document.body.style.cursor = "default";
    block.remove();
    container.remove();

    menu.style.transform = "translateY(0)";
}