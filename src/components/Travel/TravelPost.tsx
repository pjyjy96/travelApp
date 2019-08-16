import * as React from "react";
import Modal from 'react-responsive-modal';
import Col from 'react-bootstrap/Col';
import '../.././App.css';
import Button from 'react-bootstrap/Button';

interface IProps{
    searchPosts: any[],
    currentTravel: any
}

interface IState {
    open: boolean
}

export default class TravelPost extends React.Component<IProps, IState>{
    constructor(props:any){
        super(props)
        this.state = {
            open: false
        }
        this.updateTravel  = this.updateTravel.bind(this)
    }

    public render(){
        const currentTravel = this.props.currentTravel
		const{ open } = this.state
		const data = Array.from(this.props.searchPosts);

        const travel = data.map(post =>{
			return (
				<Col md={12} key={post.id} className="dark-back">
					<div className="border pad mar white-back relative">
						<div className="travel-heading">{post.title}</div>
						<div className="search-img"><img alt={post.title + ": " +post.tags} src={post.url} /></div>
						<span className="text">{post.tags}</span>
						<br/>
						<span>{post.uploaded.substring(0, 10)}</span><br/>
						<div className="btn-ctn">
							<Button onClick={this.downloadTravel.bind(this, post.url)} >Download</Button>
							<Button onClick={this.onOpenModal}>Edit </Button>
							<Button onClick={this.deleteTravel.bind(this, currentTravel.id)}>Delete </Button>
						</div>
						<Modal open={open} onClose={this.onCloseModal}>

						<form>
							<div className="form-group">
								<label>Post Title</label>
								<input type="text" className="form-control" id="travel-edit-title-input" placeholder="Enter Title" />
								<small className="form-text text-muted">You can edit any post later</small>
							</div>
							<div className="form-group">
								<label>Tag</label>
								<input type="text" className="form-control" id="travel-edit-tag-input" placeholder="Enter Tag" />
								<small className="form-text text-muted">Tag is used for search</small>
							</div>
							<button type="button" className="btn" onClick={this.updateTravel}>Save</button>
						</form>
					</Modal>
					</div>
				</Col>
			)
		})
		return travel;
    }

    // Modal Open 
    private onOpenModal = () => {
        this.setState({ open: true});

    };
    // Modal Close
    private onCloseModal = () =>{
        this.setState({open: false});        
    };

    // Open Travel photo in new tab
    private downloadTravel(url: any){
        window.open(url);
    }

    // DELETE Photos
    private deleteTravel(id:any){
        const url = "https://travelphoto.azurewebsites.net/api/TravelItems/" + id
        fetch (url,{
            method: 'DELETE'
        }).then((response:any)=>{
                if(!response.ok){
                    // Error Response
                    alert(response.statusMessage)   
                }
                else{
                    location.reload()
                }
            })
    }

	// PUT travel photos
	private updateTravel() {
		const titleInput = document.getElementById("travel-edit-title-input") as HTMLInputElement
		const tagInput = document.getElementById("travel-edit-tag-input") as HTMLInputElement

		if (titleInput === null && tagInput === null) {
			return;
		}

		const currentTravel = this.props.currentTravel
		const url = "https://travelphoto.azurewebsites.net/api/TravelItems/" + currentTravel.id
		const updatedTitle = titleInput.value
		const updatedTag = tagInput.value
console.log(tagInput.value);
console.log(titleInput.value);

		fetch(url, {
			body: JSON.stringify({
				"height": currentTravel.height,
				"id": currentTravel.id,
				"tags": updatedTag,
				"title": updatedTitle,
				"uploaded": currentTravel.uploaded,
				"url": currentTravel.url,
				"width": currentTravel.width
			}),
			headers: { 'cache-control': 'no-cache', 'Content-Type': 'application/json' },
			method: 'PUT'
		})
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText + " " + url)
				} else {
					location.reload()
				}
			})
	}
}