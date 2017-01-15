'use strict';

class Population{
    constructor() {
        this.pop=[];
        this.map={};
    }    
    static fromJSON(p){
        var population = new Common.Elements.Population();
        for (var i=0;i<p.pop.length;i++){
            population.pop[i]=Common.Elements.Individual.fromJSON(p.pop[i]);
        }
        population.bestp=p.bestp;
        population.worstp=p.worstp;
        population.bestf=p.bestf;
        population.avgf=p.avgf;
        population.worstf=p.worstf;
        population.BESTF=p.BESTF;

        population.iteration=p.iteration;

        population.map=p.map;
        return population;        
    }


exists(element){
    var group = this.map[element.fitness];
  if (group!==undefined){
    var elementString=JSON.stringify(element);
    if (group[elementString]!==undefined){
        return true;
    } else {
        return false;    
    }
  } else {
    return false;
  }
}
addIfNotExists(element,map){
    var group = map[element.fitness];
  if (group!==undefined){
    var elementString=JSON.stringify(element);
        if (group[elementString]!==undefined){
        return false;
    } else {
      group[elementString]=element;
        return true;    
    }
  } else {
    var elementString=JSON.stringify(element);
    group={};
    group[elementString]=element;
    map[element.fitness]=group;
    return true;
  }
}

deleteElement(element, map){
    var group = map[element.fitness];
    if (group!==undefined){
        var elementString=JSON.stringify(element);
      if (group[elementString]!==undefined){
        delete group[elementString]
        if (Object.keys(group).length==0) delete map[element.fitness]
        return true;
      } else {
        return false; //NO SE BORRÓ PORQUE NO EXISTÍA    
      }         
    }else {
        return false; //NO SE BORRÓ PORQUE NO EXISTÍA
    }  
}    
    initialize(popSize,size){
        for (var i = 0; i < popSize; i++){
                var indiv = new Common.Elements.Individual();
                indiv.initialize(size);
                while (!this.addIfNotExists(indiv,this.map)){
                    indiv = new Common.Elements.Individual();
                    indiv.initialize(size);
                }
                this.pop.push(indiv);
        }

        // Initialize statistics
        this.bestp = 0;     
        this.worstp = 0;
        this.bestf = 0.0;   
        this.avgf   = 0.0;   
        this.worstf = 9999999999.0;    
        this.BESTF = 0.0;

        this.iteration = 0;
        //MOSTRAR POBLACIÓN
//        for (var i=0;i<this.pop.length;i++){
//            console.log(i+" -> "+JSON.stringify(this.pop[i]))
//        }        
    }
    getSize(){
        return this.pop.length;        
    }
    getIndividual(index){
        return this.pop[index];        
    }
    setIndividual(index, indiv){
        this.pop[index]=indiv;        
    }
    replaceWorst(indiv){
        if (indiv.getChromosome().alleles.length==0) throw "ERROR no debería ser cero"
        //TODO
        //Comprobar si el que se inserta es mejor que el peor ¿comprobarlo fuera o dentro?         
      //  if (indiv.getFitness()>this.pop[this.worstp].getFitness()){

        //if (this.addIfNotExists(indiv,this.map)){
            this.deleteElement(this.pop[this.worstp],this.map);
           this.pop[this.worstp] = indiv; 
           return this.worstp;            
        //} else {
        //    return -1;
        //}

      //  } else {
      //      return -1;
      //  }        
    }   
    replace(indiv,position){//Este método se utiliza sólo cuando Monitor-Esclavo para que el esclavo pueda reemplazar
        this.pop[position] = indiv;         
    }
    getBestIndividual(){
        return this.pop[this.bestp];        
    }
    showBestFitness(){
        console.log(this.iteration+"-BEST FITNESS "+this.bestf)   
        console.log(JSON.stringify(this.getIndividual(this.bestp)))         
    }
    computeStats(){

                var borrarBESTBEFORE=this.bestf;

        
        var antiguoFitness = this.bestf;
        
	var total = 0.0;
	var f = 0.0;
	this.worstf = this.pop[0].fitness;
	this.worstp = 0;
	this.bestf = this.pop[0].fitness;
	this.bestp = 0;

	for (var i = 0; i < this.pop.length; i++){
		f = this.pop[i].fitness;
		if (f<=this.worstf) {
			this.worstf=f;
			this.worstp=i;
		}
		if (f>this.bestf){ 
			this.bestf = f; 
			this.bestp = i;			
		}
		if (f>=this.BESTF){ this.BESTF = f;}
		total+=f;
	}	
	this.avgf = total/this.pop.length;              
                
                var borrarBESTLATER=this.bestf;
                
                if (borrarBESTBEFORE !=0 && borrarBESTLATER<borrarBESTBEFORE){
                    throw "ERROR";
                    console.log("ESTO NO DEBERÍA ESTAR PASANDO")
                    console.log("borrarBESTBEFORE="+borrarBESTBEFORE)
                    console.log("borrarBESTLATER="+borrarBESTLATER)                    
                } 

	if (this.bestf>antiguoFitness){
		console.log(this.iteration+"-NUEVO FITNESS "+this.bestf)   
        console.log(JSON.stringify(this.getIndividual(this.bestp)))         
	}

	this.iteration++;          
    }
}

module.exports = Population;