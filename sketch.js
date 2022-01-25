let model;
let outcome;


function setup() {
  noCanvas();

  let options = {
    dataUrl: "data/Glassdoor Gender Pay Gap.csv",
    inputs: ["JobTitle", "Age", "Seniority", "Dept", "BasePay" ],
    outputs: ["Gender"],
    task: "classification",
    learningRate: 0.1,
    /*layers: [
      {
        type: 'dense',
        units: 16,
        activation: 'relu'
      },
      {
        type: 'dense',
        units: 16,
        activation: 'sigmoid'
      },
      {
        type: 'dense',
        activation: 'sigmoid'
      }
    ],*/
    debug: true,
  };

  model = ml5.neuralNetwork(options, modelReady);

  predictButton = select("#predict");
  predictButton.mousePressed(classify);
  predictButton.hide();

  trainButton = select("#train");

  trainButton.mousePressed(function () {
    let trainOptions = {
      epochs: 50,
      batchSize:16
    };

    model.train(trainOptions, whileTraining, finishedTraining);
  });

  trainButton.position(0, 300);
}


function whileTraining(epoch, loss) {
  console.log(`Epoch: ${epoch} - loss: ${loss.loss.toFixed(2)}`);
}

function finishedTraining() {
  console.log("done!");
  predictButton.show();
  trainButton.hide();
}

function classify() { 
  let Alter = parseInt(select("#Age").value());
  let Beruf = select("#JobTitle").elt.value;
  let Lohn = parseInt(select("#BasePay").value());
  let Berufserfahrung = parseInt(select("#Seniority").value());
  let Abteilung = select("#Dept").elt.value;

  let userInputs = {
    JobTitle: Beruf,
    Age: Alter,
    Seniority: Berufserfahrung,
    BasePay: Lohn,
    Dept: Abteilung,
  };

  model.classify(userInputs, gotResults);
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
    if (result[0].label == "Male") {
      outcome = " a man!";
    } else {
      outcome = " a woman!";
      
    }
    
    select("#result").html(
      "It's most probably" + outcome
    );
  }
}

function modelReady() {
  console.log("model ready");
  (model.data)
  model.normalizeData();
}
