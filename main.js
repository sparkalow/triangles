window.onload = function() {
    const canvas = document.getElementById("canvas");

    const colors = {
        lightGray: "rgb(210, 210, 210)",
        medGray: "rgb(150, 150, 150)",
        darkGray: "rgb(110, 110, 10)",
    };

    let ctx = canvas.getContext("2d"),
        width = (canvas.width = window.innerWidth),
        height = (canvas.height = window.innerHeight),
        centerX = width / 2,
        centerY = height / 2,
        mx = width * 0.7,
        my = height * 0.7;

    //crosshair
    let crosshair = {
        x: centerX,
        y: centerY,
        size: 8,
        theta: 0
    };

    draw = function() {
        ctx.clearRect(0, 0, width, height);
        oppositeDistance = my - centerY;
        adjacentDistance = mx - centerX;
        hypotenuse = Math.sqrt(Math.pow(oppositeDistance, 2) + Math.pow(adjacentDistance, 2));
        
        //outer circle
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgba(220, 200, 220,.7)";
        ctx.arc(centerX, centerY, hypotenuse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255, .3)";
        ctx.fill();
        ctx.closePath();

        //inner circle
        var innerDiameter = Math.max(1, Math.min(68, hypotenuse / 3));
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgb(220, 220, 220)";
        ctx.arc(centerX, centerY, innerDiameter, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(175, 165, 190, .1)";
        ctx.fill();
        ctx.closePath();

        //triangle
        //hypotenuse
        ctx.beginPath();
        ctx.strokeStyle = "rgb(255, 125, 0)";
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(mx, my);
        ctx.lineTo(mx, centerY);
        
        //adjacent
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
        ctx.fillStyle = "rgba(255, 165, 0, .1)";
        ctx.fill();
        ctx.closePath();
        output(adjacentDistance, "adjacent");
        output(hypotenuse, "hypotenuse");
        output(oppositeDistance, "opposite");

        //crosshair
        crosshair.theta = Math.atan2(oppositeDistance, adjacentDistance);
        crosshair.x = centerX + Math.cos(crosshair.theta) * innerDiameter;
        crosshair.y = centerY + Math.sin(crosshair.theta) * innerDiameter;
    
        ctx.beginPath();
        ctx.strokeStyle = "rgb(200, 200, 200)";
        ctx.arc(crosshair.x, crosshair.y, crosshair.size, 0, Math.PI * 2);
        // ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = "rgba(55, 205, 105, 0.2)";
        ctx.fill();
        output(crosshair.theta, "theta");

        drawSpokes(hypotenuse, 8);
         
        window.requestAnimationFrame(draw);
    };
    
    
    window.requestAnimationFrame(draw);
    window.addEventListener("mousemove", function(e) {
        mx = e.clientX;
        my = e.clientY;
    });

    window.addEventListener('resize', function(){
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    })

    function drawSpokes(radius, segments) {
        const step = Math.round(360 / segments);
        ctx.strokeStyle = colors.lightGray;
        // ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.setLineDash([2, 3]);
        ctx.textAlign = 'center';
        ctx.font = '11px sans-serif';
        ctx.fillStyle = colors.medGray;
        
        for (let i = 0; i < 360; i += step) {
            var angle = i;
            var x = centerX + Math.cos(degToRad(angle)) * radius;
            var y = centerY + Math.sin(degToRad(angle)) * radius;

            ctx.fillText(i+'°', x, y, 100);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
        }

        ctx.setLineDash([]);
    }

    function degToRad(degrees) {
        return (degrees * Math.PI) / 180;
    }

    function output(val, id) {
        try {
            if (typeof val == "number") {
                val = val.toFixed(2);
            }
            document.getElementById(id).innerText = val;
        } catch (error) {
            console.error(error);
        }
    }
};
