import React, { Component } from 'react';

export default React.createClass({
  render() {
    return(
      <main className="page-chat">
    		<header>
    			<div>{this.props.params.username}</div>
    		</header>
    		<section className="content">
    			<div className="other">
    				<p>12 janvier 2017 à 15h32</p>
    				<div className="post">
    					<p>Le message qui sera écrit...</p>
    				</div>
    			</div>
    			<div className="mine">
    				<p>12 janvier 2017 à 16h12</p>
    				<div className="post">
    					<p>Le message qui sera écrit également...</p>
    				</div>
    			</div>
    			<div className="mine">
    				<p>12 janvier 2017 à 16h12</p>
    				<div className="post">
    					<p>Le message qui sera écrit également...</p>
    				</div>
    			</div>
    			<div className="other">
    				<p>12 janvier 2017 à 15h32</p>
    				<div className="post">
    					<p>Le message qui sera écrit...</p>
    				</div>
    			</div>
    			<div className="other">
    				<p>12 janvier 2017 à 15h32</p>
    				<div className="post">
    					<p>Le message qui sera écrit...</p>
    				</div>
    			</div>
    			<div className="other">
    				<p>12 janvier 2017 à 15h32</p>
    				<div className="post">
    					<p>Le message qui sera écrit...</p>
    				</div>
    			</div>
    			<div className="mine">
    				<p>12 janvier 2017 à 16h12</p>
    				<div className="post">
    					<p>Le message qui sera écrit également...</p>
    				</div>
    			</div>
    			<div className="mine">
    				<p>12 janvier 2017 à 16h12</p>
    				<div className="post">
    					<p>Le message qui sera écrit également...</p>
    				</div>
    			</div>
    		</section>
    		<section className="write-message">
    			<textarea rows="3" placeholder="Ecrire le message..."></textarea>
    			<button type="submit">Ok</button>
    		</section>
    	</main>
    );
  }
})
