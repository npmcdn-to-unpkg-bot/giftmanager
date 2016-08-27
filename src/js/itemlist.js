(function(React){

        "use strict";

/*
$status[0] = 'none';
$status[2] = 'reserved';
$status[10] = 'purchased';
$status[50] = 'cancelled';
*/


        const thisUserID = 58627; //set this after authentication.

        var ItemList = React.createClass({

            loadItemListFromServer: function() {
                $.ajax({
                    url: this.props.ItemListUrl,
                    dataType: 'json',
                    cache: false,
                    success: function(data) {
                        this.setState({data: data});
                    }.bind(this),
                    error: function(xhr, status, err) {
                        console.error(this.props.ItemListUrl, status, err.toString());
                    }.bind(this)
                });
            },

            getInitialState: function() {
                return {
                    data: [],
                    subjectUID : thisUserID,
                };
            },
            componentDidMount: function() {
                this.loadItemListFromServer();
                if(this.props.pollInterval) {
                    setInterval(this.loadItemListFromServer, this.props.pollInterval);
                }
            },

            render: function() {
                return (

                        <div className="item-list">
                            <ItemListTable data={this.state.data} subjectUID={this.state.subjectUID} itemListUrl={this.props.ItemListUrl} />
                        </div>
                );
            }
        });



        // tutorial2.js
// tutorial10.js
        var ItemListTable = React.createClass({
            render: function() {
              let subjectUID = this.props.subjectUID;
                let itemListUrl = this.props.itemListUrl;
                var items = this.props.data.map(function(item) {
                    return (
                            <Item item={item} key={item.itemid} subjectUID={subjectUID} itemListUrl={itemListUrl}>
                            </Item>
                    );
                });
                return (
                        <table className="table">
                            <tbody>
                            {items}
                            </tbody>
                        </table>
                );
            }
        });


        var Item = React.createClass({

          handleStatusChange : function(event) {
              this.setState({status: event.target.value});
              let props = this.props.item;
              let APIURL = this.props.itemListUrl
              console.log(" -> props.itemid: " + props.itemid);
              //todo ->need to do a post here.
              $.ajax({
                  url: APIURL,
                  dataType: 'json',
                  type: 'POST',
                  data : {
                    "itemid" : props.itemid,
                    "status": event.target.value
                  },
                //  data: { },
                  success: function(data) {
                    console.log("Got to the ajax success!" , data);
                      this.setState({data: data});
                  }.bind(this),
                  error: function(xhr, status, err) {
                      console.error(props.url, status, err.toString());
                  }.bind(this)
              });
          },

            render: function() {
                return (
                        <tr className={'status-'+this.props.item.status}>
                            <td>
                                <a href={this.props.item.item_link} target='_blank' className={this.props.item.item_link ? ''  : 'hidden-xs-up'}>link</a>
                            </td>
                            <td>
                                {this.props.item.item_name}<br />
                                {this.props.item.show_description}
                            </td>
                            <td>
                                <ItemSelectListOther status={this.props.item.status} onStatusChange={this.handleStatusChange} />
                            </td>
                        </tr>
                );
            }
        });


                var ItemSelectListSelf = React.createClass({
                  render : function(){
                    let selectEvent = this.props.onStatusChange;
                    console.log("selectEvent: " + selectEvent);
                    return (
                      <select  onChange={selectEvent} >
                        <option></option>
                        {this.props.status === 50 ? <option>UnCancel</option> : <option>Cancel</option>}
                      </select>
                    );
                  }
                });

                var ItemSelectListOther = React.createClass({
                  getInitialState: function() {
                     return {
                         status: '',
                         itemid: ''
                     }
                 },
                  render : function(){

                    return (

                      <select defaultValue={this.props.status} onChange={this.props.onStatusChange} data={this.props.itemid}>
                        <option></option>
                        <option value='2'>Reserved</option>
                        <option value='10'>Purchased</option>
                        {(() => {
                          switch (this.props.status) {
                            case 2:   return <option value='XX'>Unreserve</option>;
                            case 10: return <option value='XX'>Unpurchase</option>;
                            default:      return "";
                          }
                        })()}
                      </select>
                    );
                  }
                });



        ReactDOM.render(

                <ItemList ItemListUrl="api/list.json" pollInterval={0} />,
                document.getElementById('itemListContainer')
        );

         })(React);
