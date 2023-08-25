import { Document, Packer, Table, TableCell, TableRow, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

// Listen for clicks on Generate Word Document button
document.getElementById("generate").addEventListener(
  "click",
  function(event) {
    generateWordDocument(event);
  },
  false
);
  
function generateWordDocument(event) {
  event.preventDefault();
    
    const textarea = document.getElementById("songs");
    if(!textarea) return;
    const songs = textarea.value.split("\n");
    console.log(songs);
    const files = document.getElementById("numfiles").value;
    const columnes = document.getElementById("numcolumnes").value;
    const cells = files * columnes;
    console.log("cells: "+cells);
    const num = document.getElementById("num").value;
    console.log("num: "+num);
    let cartrons = [];
    var cartro;
    var auxset;
    var number;
    var sortedaux1, sortedaux2;
    var iguals;
    var error = 0;
    for(var i = 0; i < num && error < 100;)
    {
      auxset = [...songs];
      cartro = [];
      for(var j = 0; j < cells; j++)
      {
        number = Math.floor(Math.random() * auxset.length);
        cartro.push(auxset[number]);  //Pot ser cartro.push(auxset.splice(number, 1)); crec
        auxset.splice(number, 1);
      }
      for(var k = 0; k < cartrons.length; k++)
      {
        iguals = false;
        sortedaux1 = [...cartro];
        sortedaux1.sort();
        sortedaux2 = [...cartrons[k]];
        sortedaux2.sort();
        if(sortedaux1.toString() === sortedaux2.toString()) //Segurament es poden posar moltes coses juntes. (sort i tostring)
        {
          iguals = true;
          break;
        }
      }
      error++;
      if(!iguals)
      {
        cartrons.push(cartro);
        console.log(cartrons[i]);
        i++;
        error = 0;
      }
    }

    var tc, tr, t = [];
    var row, tab;

    for(var i = 0; i < num; i++)
    {
      tr = [];
      for(var fil = 0; fil < files; fil++)
      {
        tc = [];
        console.log("fila");
        for(var col = 0; col < columnes; col++)
        {
          tc.push(new TableCell({
            width: {
                size: 3505,
                type: "WidthType.DXA",
            },
            children: [new Paragraph(cartrons[i][columnes*fil+col])]}),);
            console.log(cartrons[i][columnes*fil+col]);
        }
        tr.push(new TableRow({children: tc,}),);
      }
      t.push(new Table({
        columnWidths: [3505],
        rows: tr,}));
      t.push(new Paragraph(""));
    }
  
  const doc = new Document({
      sections: [{
          children: t,
      }],
  });
    
      Packer.toBlob(doc).then((blob) => {
        console.log(blob);
        saveAs(blob, "example.docx");
        console.log("Document created successfully");
      });
}
  