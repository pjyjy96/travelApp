import * as React from "react";
import Col from 'react-bootstrap/Col';
import '../.././App.css';
import Button from "react-bootstrap/Button";

interface IProps {
	travelPosts: any[]
	fetchTravelPosts: any
}

interface IState {
	open: boolean
}


export default class PostList extends React.Component<IProps, IState> {
	constructor(props: any) {
		super(props)
	}

	public render() {
		const travel = this.props.travelPosts.map(post => {
			return (
				<Col md={12} key={post.id} className="dark-back pad">
					<div className="border relative white-back post-pad">
						<div className="travel-heading"><b>{post.title}</b></div>
						<div className="pad-img">
							<img alt={post.title + ": " +post.tags} src={post.url} />
						</div>
						<span className="text">{post.tags}</span>
						<br/>
						<div className="fb-share-button" data-href="https://travelphoto.azurewebsites.net/" data-layout="button_count" data-size="small" data-mobile-iframe="true"><a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u=" + "https://www.google.com"} className="fb-xfbml-parse-ignore">Share</a></div>
						<Button onClick={this.downloadTravel.bind(this, post.url)} >Download</Button>
						<br/>
						<span>{post.uploaded.substring(0, 10)}</span>
					</div>
				</Col>
			)
		})
		return travel;
	}

	// Opening image file in a new tab with Url
	private downloadTravel(url: any) {
		window.open(url);
	}
}