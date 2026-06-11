let ds = d3.select("#drawspace");
    d3.csv('dataset.csv').then(funDraw)
    function funDraw(myData) {
      
      myData=myData.map(d=>({
        Year : d.Year.substring(0, 4),
        CowMilk : d.CowMilk,
        GoatMilk : d.GoatMilk,
        BuffaloMilk : d.BuffaloMilk
      }));
      console.log(myData)
      let dsh=350;
      let dsw=600;
      
      let yscale=d3.scaleLinear().domain([0,80000]).range([dsh,0]);
      let xscale=d3.scaleLinear().domain([1999,2016]).range([0,dsw]);
      
      ds.append("g").call(d3.axisLeft(yscale).ticks(15));
      ds.append("g").call(d3.axisBottom(xscale).ticks(15)) 
        .attr("transform" , " translate(0,"+dsh+")");

      let myLine=d3.line().x(d=>xscale(+d.Year)).y(d=>yscale(+d.CowMilk));
      ds.append("path").datum(myData).attr("d",myLine).attr("fill","none").attr("stroke","red");
      ds.append('g').selectAll('circle').data(myData)
            .enter().append('circle')
            .attr('cx',d=>xscale(+d.Year))
            .attr('cy',d=>yscale(+d.CowMilk))
            .attr('r',3)
            .attr('fill','red');

      let yscale1=d3.scaleLinear().domain([0,80000]).range([dsh,0]);

      let myLine1=d3.line().x(d=>xscale(+d.Year)).y(d=>yscale1(+d.GoatMilk));
      ds.append("path").datum(myData).attr("d",myLine1).attr("fill","none").attr("stroke","blue");
      ds.append('g').selectAll('circle').data(myData)
            .enter().append('circle')
            .attr('cx',d=>xscale(+d.Year))
            .attr('cy',d=>yscale(+d.GoatMilk))
            .attr('r',3)
            .attr('fill','blue');

      let yscale2=d3.scaleLinear().domain([0,80000]).range([dsh,0]);

      let myLine2=d3.line().x(d=>xscale(+d.Year)).y(d=>yscale1(+d.BuffaloMilk));
      ds.append("path").datum(myData).attr("d",myLine2).attr("fill","none").attr("stroke","green");
      ds.append('g').selectAll('circle').data(myData)
            .enter().append('circle')
            .attr('cx',d=>xscale(+d.Year))
            .attr('cy',d=>yscale(+d.BuffaloMilk))
            .attr('r',3)
            .attr('fill','green');
      d3.select('svg').append('g').attr('class','cow').attr('transform','translate(700,100)')
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", 'red')
        .style("stroke", 'red');
      d3.select('.cow').append("text")
        .attr("x", 22)
        .attr("y", 14)
        .text("CowMilk");
      d3.select('svg').append('g').attr('class','buff').attr('transform','translate(700,120)')
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", 'green')
        .style("stroke", 'green');
      d3.select('.buff').append("text")
        .attr("x", 22)
        .attr("y", 14)
        .text("BuffaloMilk");
      d3.select('svg').append('g').attr('class','goat').attr('transform','translate(700,140)')
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", 'blue')
        .style("stroke", 'blue');
      d3.select('.goat').append("text")
        .attr("x", 22)
        .attr("y", 14)
        .text("GoatMilk");

    }