import * as React from "react";
import { Button, Form, FormGroup, FormControl } from 'react-bootstrap';


interface IProps{
    searchPosts: any[],
    selectNewPost: any,
    searchByTag: any
}

export default class TravelList extends React.Component<IProps,{}>{
    constructor(props:any){
        super(props)
        this.searchByTag = this.searchByTag.bind(this)
    }

	public render() {
		return (
			<div className="dark-back">
				<div className="pad">
					<Form inline={true}>
						<FormGroup>
							<FormControl className="search-width" type="text" id="search-tag-textbox" placeholder="Where to next?" />
						</FormGroup>{' '}
						<Button onClick={this.searchByTag}>Search</Button>
					</Form>
				</div>
			</div>
		);
    }
    
    // Search post by tag
    private searchByTag(){
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox == null){
            return;
        }
        this.props.searchByTag(textBox.value)
    }
}

