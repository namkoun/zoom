

var socket = io()

//웹소켓
socket.on('connect',function (){

    var name = prompt('반갑습니다','')

    if (!name){
        name = '익명'
    }

    //서버에 새로운 유저가 왔다고 알림
    socket.emit('newUser',name)
})
//받기
socket.on('update', function (data){
    console.log(`${data.name}: ${data.message} ${data.type}`)
    console.log(`${data.id} 이거`)
    //입장시
    if (data.type === 'connect'){
        $(".main-l-top").append(` <div class="user">
                                    <img src="" alt="">
                                    <span class="item-span">${data.realname}</span>
                                </div>`)

        $(".chat-team-box").append(` <div class="team">
                                        <div class="img-box"> <img src="" alt=""></div>
                                        <span class="item-span">${data.realname}</span> 님
                                    </div>`)

        $("#conunt-all-sp").text($(".chat-team-box").children().length -1)
    } else if (data.type === 'endd'){
      if($(".item-span:contains("+data.id+")")){
          console.log("있음")
          console.log($(".item-span:contains("+data.id+")").parent().attr('class'))
          $(".item-span:contains("+data.id+")").parent().remove();
          $("#conunt-all-sp").text($(".chat-team-box").children().length -1)
          return
      }else {
          console.log("없음")
      }
    }
    $("#chat-area").append(`<div>${data.name}: ${data.message} </div>`)
})


function send(){
    var message = document.getElementById('test').value

    document.getElementById('test').value = ''

    $("#chat-area").append(`<div>나 : ${message} </div>`)
    socket.emit('message',{type:'message', message:message})
}

function endd(){

     var enddd = "pageend"
    socket.emit('endbutton',{type:'endd', message:enddd})

    $(location).attr('href', 'http://localhost:8080/');
}




