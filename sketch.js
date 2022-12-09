inputs = [1];

inputNeurons = [];

let output;

function setup() {
    canvas = createCanvas(windowWidth*0.6, windowWidth/4);
    canvas.parent('sketch1');

    network = new Network(width/2,height/2);
  
  for(i = 0; i<inputs.length;i++) {
    inputNeurons[i] = new Input(-200,i*200/inputs.length-((inputs.length-1)*100/inputs.length),"x"+i,inputs[i]);
  }
  
  a = new Neuron(0,0);
  
  network.addNeuron(a);
  
  for(i = 0; i<inputNeurons.length;i++) {
    network.addInput(inputNeurons[i]);
    network.connect(inputNeurons[i],a,round(random(-1,1),2))
  }
    
    output = network.feedforward();
  outputNeuron = new Output(150,0,"y",activate(output));
  network.addOutput(outputNeuron);
  network.connect(a,outputNeuron);

    label1 = createElement('p','w0 ');
    label1.id('label')
    label1.parent('sketch1')
    slider1 = createSlider(-1, 1, network.connections[0].weight,0.01);
    slider1.id('slider1')
    slider1.parent('label')
    canvas.parent('label');


  
  slider1.input(()=> {
    network.connections[0].weight = slider1.value()
  })



}

function draw() {
  network.outputs[0].value = activate(network.feedforward());
  background(255);
  translate(width / 2, height / 2);
  scale(width/500);
  // Show the network.
  network.display();
}


function activate(sum) {
  if (sum > 0) return 1;
  else return -1;

}


  function windowResized() {
    if(windowWidth < 800) {
        resizeCanvas(windowWidth*0.6, windowWidth/2);
  
    }
  }

  class Connection {
    constructor(from, to, w) {
      // Connection has a weight
      this.weight = w;
      // Connection is from Neuron A to B
      this.a = from;
      this.b = to;
    }
  
    // Draw line and traveling circle
    display() {
        
      stroke(0);
      strokeWeight(abs(this.weight * 2));
      line(this.a.position.x, this.a.position.y, this.b.position.x, this.b.position.y);
      strokeWeight(.5);
      
          if(this.a instanceof Input) {
        textSize(10);
        this.test = text("w" + this.a.name[1] + " = " + this.weight,this.b.position.x+this.a.position.x*0.75,this.a.position.y - 5);
  
      }
    
    }
    
  }

  class Input {
  
    constructor(x,y,name,value) {
      this.position = createVector(x, y);
      this.size = 10;
      this.connections = [];
      this.value = value;
      this.name = name;
    }
  
    display() {
      stroke(0);
      fill(0)
      strokeWeight(0);
      textAlign(RIGHT);
      textSize(this.size);
      text(this.name + " = " + this.value,this.position.x -10,this.position.y);
    }
    
    addConnection(c) {
      this.connections.push(c);
    }
  }

  //[full] A Network is a list of neurons.
class Network {

  constructor(x,y) {
    this.location = createVector(x,y);
    this.inputs = [];
    this.outputs = [];
    this.neurons = [];
    this.connections = [];
  }

  //[full] We can add an neuron to the network.
  addNeuron(neuron) {
   this.neurons.push(neuron);
  }
  
  addInput(input) {
   this.inputs.push(input);
  }
  
  addOutput(input) {
   this.outputs.push(input);
  }
  
  connect(a, b, weight) {
    let c = new Connection(a, b, weight);
    a.addConnection(c);
    this.connections.push(c);
  }
  
  feedforward() {
    let sum = 0;
    for(i = 0; i < this.connections.length-1;i++) {
      sum += this.inputs[i].value* this.connections[i].weight;
    }
    return sum;
  }
  

  //[full] We can draw the entire network.
  display() {
    for (let i = 0; i < this.connections.length; i++) {
      this.connections[i].display();
    }
    for (let i = 0; i < this.neurons.length; i++) {
      this.neurons[i].display();
    }
    
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].display();
    }
    
    for (let i = 0; i < this.outputs.length; i++) {
      this.outputs[i].display();
    }
  }
}

class Neuron {
  
  constructor(x,y) {
    this.position = createVector(x, y);
    this.size = 100;
    this.connections = [];
  }

  display() {
    stroke(0);
    strokeWeight(2);
    fill(255);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }
  
  addConnection(c) {
    this.connections.push(c);
  }
}

class Output {
  
  constructor(x,y,name,value) {
    this.position = createVector(x, y);
    this.size = 20;
    this.connections = [];
    this.value = value;
    this.name = name;
  }

  display() {
    stroke(0);
    fill(0)
    strokeWeight(0);
    textAlign(LEFT);
    textSize(this.size);
    text(this.name + " = " + this.value,this.position.x +10,this.position.y);
  }
  
  addConnection(c) {
    this.connections.push(c);
  }
}