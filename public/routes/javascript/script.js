let userId;
      fetch('/test')
      .then((response) => response.json())
      .then((data) => {
        userId = data;
        console.log(userId)
      

      })

     
      
      var socket = io()
      let documentId;
      
        var toolbarOptions = [
			  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
			  ['blockquote', 'code-block'],
			  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
			  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
			  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
			  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
			  [{ 'direction': 'rtl' }],                         // text direction
			  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
			  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
			  [{ 'font': [] }],
			  [{ 'align': [] }],
			  ['clean', 'image', 'link', 'video'],
                                              
        
                                            // remove formatting button
			];
     
      
      Quill.register('modules/cursors',QuillCursors )
var quill = new Quill('#editor', {
			  modules: {
				toolbar: toolbarOptions,		
        cursors: {
      hideDelayMs: 5000,
      hideSpeedMs: 500,
      selectionChangeSource: null,
      transformOnTextChange: true,
    },
      imageResize:{
        displaySize: true
      },
      
      history: {
        userOnly: true,
        maxStack: 100
      }
			  },
			  theme: 'snow',  // or 'bubble'
        
			});
      const cursors = quill.getModule('cursors')
      var userArr = []
    
      socket.on('connect', (socket) => {
        //cursors.createCursor(userId, userId, 'blue')
        
      })
      
      // socket.on('disconnected', () => {
      //   cursors.update()
      // })

      
        
      
      
      if(window.location.href.startsWith("https://edudocx.ml")) {
        documentId = window.location.href.slice(28)

        console.log(documentId)

        
      }
      if(window.location.href.startsWith("https://www.edudocx.ml")){
        documentId = window.location.href.slice(32)

        
      }
      
      if (window.location.href.startsWith("https://edudocx.herokuapp.com")){
        documentId = window.location.href.slice(39)
        console.log(documentId)

        
      }
      if(window.location.href.startsWith("http://localhost:3000")){
        documentId = window.location.href.slice(31)
        console.log(documentId)

        
      }
      
      
      setTimeout(() => {
        socket.emit('connected-document', documentId, userId)

      }, 500)
        
      
      
      socket.on('new-document', (data, user) => {
          quill.setContents(data.documentdata)
          //userId = user;
        
          
          return () => socket.off('new-document')
      })
      
      quill.on('text-change', (delta, oldDelta, source) => {
       if(source == 'user'){
        let updateContents = quill.updateContents()
        let quillContents = quill.getContents()
        
       // console.log(delta.ops)
        socket.emit('send-changes', { documentId: documentId, text: quillContents, delta: delta })
       }
        
  
      })
      const interval = setInterval(() => {
        socket.emit('save-document', { documentId: documentId, text: quill.getContents() })
      }, 2000)
      
      
      socket.on('receive-changes', delta => {
    
        quill.updateContents(delta)
       })
      
       quill.on('selection-change', (range, oldRange, source) => {
        if(range){
          socket.emit('selection-change', { documentId: documentId, range: range, user: userId })
          
        }
       })
       socket.on('send-selection-changes',(data) => {
        let range = data.range;
        let okId = data.documentId;
        let user = data.user
        console.log(user)
        const random_hex_color_code = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};

        cursors.createCursor(user, user, random_hex_color_code())
        
        
          cursors.moveCursor(user, range)

        
       })
      
function onClick() {
  // var pdf = new jsPDF('p', 'pt', 'letter');
  // pdf.canvas.height = 72 * 11;
  // pdf.canvas.width = 72 * 8.5;
  // pdf.fromHTML(document.getElementById('editor'));
  // pdf.save(documentId);
  const ele = document.getElementById('editor');

  html2pdf()
  .from(ele)
  .save();
};
var element = document.getElementById("clickbind");
element.addEventListener("click", onClick);


function documentTitle() {
      
  const title = document.getElementById('title')
  fetch('/documenttitles', {
    method:'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
  },

    body: JSON.stringify({
      title: title.value,
      id: documentId,
      user: userId
    })
  }).then((response) => {
    console.log(response)
  })
}