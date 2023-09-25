import { Document, Packer, Table, TableCell, TableRow, Paragraph, TextRun, WidthType, AlignmentType, VerticalAlign, convertMillimetersToTwip, BorderStyle} from "docx";
import { saveAs } from "file-saver";

// Listen for clicks on Generate Word Document button
document.getElementById("generate").addEventListener(
  "click",
  function(event) {
    generateWordDocument(event);
  },
  false
);

function removeEmpty(song){
  return song != "" && song != " " && song !=null && song != undefined;
}
  
function generateWordDocument(event) {
  event.preventDefault();
    
    const textarea = document.getElementById("songs");
    if(!textarea) return;
    console.log("1");
    const songs = textarea.value.split("\n").filter(removeEmpty);
    console.log(songs);
    const title = document.getElementById("titol").value;
    console.log(title);
    const files = document.getElementsByName("numfiles")[0].value;
    console.log(files);
    const columnes = document.getElementsByName("numcolumnes")[0].value;
    console.log(columnes);
    const cells = files * columnes;
    const num = document.getElementsByName("num")[0].value;
    console.log(num);
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
        for(var col = 0; col < columnes; col++)
        {
          tc.push(new TableCell({
            width: { 
              size: 100 / columnes, 
              type: WidthType.PERCENTAGE,
            },
            verticalAlign: VerticalAlign.CENTER,
            margins: {
              top: convertMillimetersToTwip(5),
              bottom: convertMillimetersToTwip(5),
              left: convertMillimetersToTwip(2),
              right: convertMillimetersToTwip(2),
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({                    
                    text: cartrons[i][columnes*fil+col],
                    bold: true,
                    size: 20,
                    alignment: AlignmentType.CENTER,
                  })
                ]
              })]}));
        }
        tr.push(new TableRow({
          children: tc,
          cantSplit: true,
        }),);
      }
      t.push(new Table({
        rows: [new TableRow({
          children: [new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({                    
                    text: title,
                    bold: true,
                    size: 40,
                  })]}),
              new Table({
                rows: tr,
              }),
            ],
            borders: {
              top: {
                size: 1
              },
              bottom: {
                size: 1
              },
              left: {
                size: 1
              },
              right: {
                size: 1
              },
            },
          }),],
          cantSplit: true
        }),],
        margins: {
          bottom: convertMillimetersToTwip(30),
        },
      }));
    }
  
  const doc = new Document({
      sections: [{
          children: 
            t,
      }],
  });
    
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Bingo.docx");
      });
}

  