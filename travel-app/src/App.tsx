import * as React from 'react';
import './App.css';
import Modal from 'react-responsive-modal';
import { Col, Container, NavItem, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import * as Webcam from "react-webcam";
import * as firebase from "firebase";
import { cred } from "./config/cred";
import { FirebaseAuthProvider} from "@react-firebase/auth";
import Travel from './components/Travel/Travel';
import logo from './wherelogo.png';
import  TravelList from './components/Travel/TravelList';
import TravelPost from './components/Travel/TravelPost';


interface IState {
  authenticated: boolean,
  currentPost: any,
  loginOpen: boolean,
  open: boolean,
  predictionResult: any,
  refCamera: any,
  searchPosts: any[],
  travelPosts: any[],
  uploadFileList: any,
  userPhoto:any,
  userName:any
}

class App extends React.Component <{}, IState> {
  public constructor(props:any){
    super(props);
    this.state = {
      authenticated: false,
      currentPost:{"id":0,"title":"Loading","tags":"hamilton","uploaded":"","width":"0","height":"0"},
      loginOpen:false,
      open:false,
      predictionResult: 0.0,
      refCamera: React.createRef(),
      searchPosts:[],
      travelPosts:[],
      uploadFileList:null,
      userName: "",
      userPhoto:"" 
    }
    
	this.fetchTravelPosts("")
	this.fetchPosts("")
	this.selectNewPost = this.selectNewPost.bind(this)
	this.authenticate = this.authenticate.bind(this)
	this.fetchPosts = this.fetchPosts.bind(this)
    this.googleAuth = this.googleAuth.bind(this)
    this.handleFileUpload = this.handleFileUpload.bind(this)
	this.uploadPost = this.uploadPost.bind(this)
	
}

public render() {
    const { open } = this.state;
		const { loginOpen } = this.state;
		const { authenticated } = this.state;
		return (
		<div className="">
			<Navbar>
				<Navbar.Brand><img src={logo} /></Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse className="justify-content-end">
          			{(authenticated) ? 
						<Button className="nav-btn" onClick={this.onOpenModal}>Share your photos📷</Button>
						:
						<Button className="nav-btn" onClick={this.onOLoginModal}>Share your photos📷</Button>
					}

					{(authenticated) ? 
						<NavItem >Welcome {this.state.userName}</NavItem>
						:
						<Button className="nav-btn" onClick={this.onOLoginModal}>Login</Button>
					}
				</Navbar.Collapse>

			{(!authenticated) ?
				<FirebaseAuthProvider {...cred} firebase={firebase}>
					<Modal open={!authenticated && loginOpen} onClose={this.authenticate || !loginOpen} closeOnOverlayClick={false} showCloseIcon={false} center={true}>
						<Webcam audio={false} screenshotFormat="image/jpeg" ref={this.state.refCamera}/>
						<div className="login-btn">
							<Button onClick={this.authenticate}>
								Log in using Webcam
							</Button>
							<Button onClick={this.googleAuth}>
								Log in with Google
							</Button>
						</div>
					</Modal>
			</FirebaseAuthProvider>
					: ""}
			</Navbar>

			<Container>
				<Row className="show-grid" >
					<Row className="dark-back post-pad top-board border" >
						<Col md={7}>
							<div><b>
								Share your foodie experiences with everyone on this platform!<br/>
								Gather your friends and LET'S GO THERE!<br/><br/>
								Simply log in using your Webcam (Admin required), Google, or Facebook account.
								</b>
							</div>
							<Travel travelPosts={this.state.travelPosts} fetchTravelPosts={this.fetchTravelPosts}/>
						</Col>
						<Col md={5}>
							<div className="col-12">
								<TravelList searchPosts={this.state.searchPosts} selectNewPost={this.selectNewPost} searchByTag={this.fetchPosts}/>
							</div>
							<div className="col-12">
								<TravelPost searchPosts={this.state.searchPosts} currentTravel={this.state.currentPost} />
							</div>
						</Col>
					</Row>
				</Row>
			</Container>
      <Modal open ={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Post Title</label>
						<input type="text" className="form-control" id="post-title-input" placeholder="Enter Title" />
						<small className="form-text text-muted">Where was this?</small>
					</div>
					<div className="form-group">
						<label>Your Feedback</label>
						<input type="text" className="form-control" id="post-tag-input" placeholder="Enter Description" />
						<small className="form-text text-muted">How good was it?</small>
					</div>
					<div className="form-group">
						<label>Show us some photos!</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="travel-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.uploadPost}>Share!</button>
				</form>
			</Modal>
		</div>
		); 
  }
  
  	// Modal open
	private onOLoginModal = () => {
		this.setState({ loginOpen: true });
	};

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
  };
  
  	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};

	// Change selected post
	private selectNewPost(newPost: any) {
		this.setState({
			currentPost: newPost
		})
	}
  
  // Google authentication
  private googleAuth = () => {
		const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(googleAuthProvider).then(result => {
			if ('user' in result){
				if(result.user!.displayName !== undefined){
					this.setState({ userName: result.user!.displayName });
					this.setState({authenticated: true})
				}
			}else{
				console.log("Error logging in")
				this.setState({authenticated: false})
			}
		});
  }
  	// Sets file list
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	// POST post
	private uploadPost() {
		const titleInput = document.getElementById("post-title-input") as HTMLInputElement
		const tagInput = document.getElementById("post-tag-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const url = "https://travelphoto.azurewebsites.net/api/TravelItems/upload"
		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Tags", tag)
		formData.append("image", imageFile)

		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
    .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		})
  }

		// GET posts
		private fetchPosts(tag: any) {
			let url = "https://travelphoto.azurewebsites.net/api/TravelItems"
			if (tag !== "") {
				url += "/tag?=" + tag
			}
			fetch(url, {
					method: 'GET'
			})
			.then(res => res.json())
			.then(json => {
				let currentPost = json[0]
				console.log(currentPost)
				console.log(json)
				if (currentPost === undefined) {
					currentPost = {"id":0, "title":"No posts (╯°□°）╯︵ ┻━┻","url":"","tags":"try a different tag","uploaded":"","width":"0","height":"0"}
				}
				this.setState({
					currentPost,
					searchPosts: json
				})
			});
		}

  	// GET posts
	private fetchTravelPosts(tag: any) {
		let url = "https://travelphoto.azurewebsites.net/api/TravelItems"
		if (tag !== "") {
			url += "/tag?=" + tag
		}
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
					this.setState({
						travelPosts: json
					})
        });
	}

  // Authentication
	private authenticate() { 
		const screenshot = this.state.refCamera.current.getScreenshot();
		this.getFaceRecognitionResult(screenshot);
	}

	// Call custom vision model
	private getFaceRecognitionResult(image: string) {
		const url = "https://australiaeast.api.cognitive.microsoft.com/customvision/v3.0/Prediction/2f841539-753e-42c1-8f1f-f2f58be7273c/classify/iterations/Iteration1/image"
		if (image === null) {
			return;
		}
		const base64 = require('base64-js');
		const base64content = image.split(";")[1].split(",")[1]
		const byteArray = base64.toByteArray(base64content);
		fetch(url, {
			body: byteArray,
			headers: {
				'Content-Type': 'application/octet-stream', 'Prediction-Key': '823612dbebad4266bb685872de7894f0','cache-control': 'no-cache'
			},
			method: 'POST'
		})
			.then((response: any) => {
				if (!response.ok) {
					// Error State
					alert(response.statusText)
				} else {
					response.json().then((json: any) => {
						console.log(json.predictions[0])

						this.setState({predictionResult: json.predictions[0] })
						if (this.state.predictionResult.probability > 0.7) {
							if(json.predictions[0] !== undefined){
								this.setState({ userName: json.predictions[0].tagName });
							}
							this.setState({authenticated: true})
						} else {
							this.setState({authenticated: false})
							
            }
            
					})
				}
			})
	}
}
export default App;
