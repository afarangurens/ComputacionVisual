let flock;

function setup() {
  createCanvas(600, 400);
  flock = new Flock();
  for (let i = 0; i < 100; i++) {
    let fish = new Fish(random(width), random(height));
    flock.addFish(fish);
  }
}

function draw() {
  background(220);

  flock.run();
}

class Flock {
  constructor() {
    this.fish = [];
  }

  addFish(fish) {
    this.fish.push(fish);
  }

  run() {
    for (let fish of this.fish) {
      fish.flock(this.fish);
      fish.update();
      fish.display();
      fish.checkEdges();
    }
  }
}

class Fish {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 2;
    this.maxForce = 0.1;
    this.perceptionRadius = 50;
  }

  flock(others) {
    let separation = this.separate(others);
    let alignment = this.align(others);
    let cohesion = this.cohere(others);

    separation.mult(2);
    alignment.mult(1.0);
    cohesion.mult(1.0);

    this.applyForce(separation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  display() {
    fill(0, 150, 255);
    noStroke();
    ellipse(this.position.x, this.position.y, 10, 10);
  }

  checkEdges() {
    if (this.position.x > width) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = width;

    if (this.position.y > height) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = height;
  }

  separate(others) {
    let sum = createVector();
    let count = 0;

    for (let other of others) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other !== this && d < this.perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d);
        sum.add(diff);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxSpeed);
      sum.sub(this.velocity);
      sum.limit(this.maxForce);
    }

    return sum;
  }

  align(others) {
    let sum = createVector();
    let count = 0;

    for (let other of others) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other !== this && d < this.perceptionRadius) {
        sum.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxSpeed);
      sum.sub(this.velocity);
      sum.limit(this.maxForce);
    }

    return sum;
  }

  cohere(others) {
    let sum = createVector();
    let count = 0;

    for (let other of others) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other !== this && d < this.perceptionRadius) {
        sum.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    }

    return sum;
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }
}
