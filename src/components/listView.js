import React, {Component} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

// fake data generator
const getItems = count => Array.from({
    length: count
}, (v, k) => k).map(k => ({id: `item-${k}`, content: `item ${k}`}));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging background: isDragging     ?
    // 'lightgreen'     : 'grey', styles we need to apply on draggables
    ...draggableStyle
});

// const getListStyle = isDraggingOver => ({     background: isDraggingOver    ?
// 'lightblue'         : 'lightgrey',     padding: grid });

class ListView extends Component {
    constructor(props) {
        super(props);
        this.itemInfo = React.createRef();
        this.state = {
            items: getItems()
        };
        console.log(this.state.items);
        this.onDragEnd = this
            .onDragEnd
            .bind(this);
        this.dateTime = this
            .dateTime
            .bind(this);
        
    }

    componentDidMount(){
        var context = this;
        this
            .props
            .database
            .database()
            .ref('messages/')
            .on("value", function (snapshot) {
                console.log(snapshot.val());
                if (snapshot.val() != null) {
                    var displayArray = [];
                    Object
                        .keys(snapshot.val())
                        .map((key, index) => {
                            var newPush = snapshot.val()[key]
                            newPush.key = key
                            displayArray.push(newPush)
                        });
                    context.setState({items: displayArray});
                }else{
                    context.setState({items: []});
                }
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(this.state.items, result.source.index, result.destination.index);

        this.setState({items});
    }

    dateTime(timeStamp) {
        var theDate = new Date(timeStamp);
        var dateString = theDate.toUTCString();
        return (dateString);
    }

    // Normally you would want to split things out into separate components. But in
    // this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                            {this
                                .state
                                .items
                                .map((item, index) => (
                                    <Draggable
                                        isDragDisabled={true}
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(provided.draggableProps.style)}
                                                className="jumbotron">
                                                <p>id: {item.id}</p>
                                                <p>text: {item.text}</p>
                                                <p>{this.dateTime(item.timeStamp)}</p>
                                                <Seconds myKey={item.key} time={item.timeStamp} database={this.props.database}/>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

class Seconds extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.state.seconds = ((this.props.time-Date.now()+30000)/1000);
        console.log(this.props.timeStamp);
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.startTimer();
    }

    startTimer() {
        if (this.timer === 0) {
            this.timer = setInterval(this.countDown, 10);
        }
    }

    countDown(){
        this.setState({seconds: ((this.props.time-Date.now()+30000)/1000)})
        if (this.state.seconds <= 0){
            this.setState({seconds: 0})
            clearInterval(this.timer);
            this.props.database.database().ref('messages/'+this.props.myKey).set({})
        }
    }

    render() {
        return (
            <p>{this.state.seconds}</p>
        )
    }
}

export default ListView;
