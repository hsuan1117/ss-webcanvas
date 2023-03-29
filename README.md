# Software Studio 2023 Spring

## Assignment 01 Web Canvas

### Scoring

| **Basic components** | **Score** | **Check** |
|:---------------------|:---------:|:---------:|
| Basic control tools  |    30%    |     Y     |
| Text input           |    10%    |     Y     |
| Cursor icon          |    10%    |     Y     |
| Refresh button       |    5%     |     Y     |

| **Advanced tools**     | **Score** | **Check** |
|:-----------------------|:---------:|:---------:|
| Different brush shapes |    15%    |     Y     |
| Un/Re-do button        |    10%    |     Y     |
| Image tool             |    5%     |     Y     |
| Download               |    5%     |     Y     |

| **Other useful widgets** | **Score** | **Check** |
|:-------------------------|:---------:|:---------:|
| Name of widgets          |   1~5%    |     N     |

---

### How to use

#### Main UI Introduction
There are five parts in the painter.
![](https://i.imgur.com/KjWhWDR.png)

On the top, there are "File" and "Cloud Service", where you can access some general functions.
Below them, there are some brush tools and font style selector, you can edit font and font size there.

On the right panel, you can edit some styles and file name.
The left panel with a border is the canvas you can draw on it.

The bottom status line shows the cursor location and size of the document.

#### Basic Component
##### Basic Control Tools
###### Brush and Eraser
Just click the button and you can use the brush and eraser
![](https://i.imgur.com/chlu315.png)
![](https://i.imgur.com/i98zlU4.png)

###### Color Selector
There are two types of color picker in this project
You can set the background color
![](https://i.imgur.com/wc8Z1hK.png)
and font color
![](https://i.imgur.com/eWCU5iI.png)
also line color
![](https://i.imgur.com/bgDobzS.png)

###### Brush size
You can modify it on the right panel
![](https://i.imgur.com/GatdDZM.png)

##### Text Input
Select the text input mode to start inputing words.
![](https://i.imgur.com/hZJw1gc.png)

You can also edit the typeface and font size on the menu bar.
![](https://i.imgur.com/vNW4MtD.png)

##### Cursor Icon
You can change the mode and hover the canvas to try

##### Refresh Button
To reset the canvas, press the trashcan icon
![](https://i.imgur.com/u5FJOk3.png)

#### Advanced Tools
##### Different brush shapes
There are rectangle (square), ellipse (circle), triangle (equilateral triangle)
![](https://i.imgur.com/Wa4MW89.png)

##### Undo / Redo
You can use it on the menu bar
![](https://i.imgur.com/uHiqT5m.png)

##### Image Tool
You can insert a image using the image tool
![](https://i.imgur.com/VLyyhyo.png)

##### Download
You can save the file in the "File" Menu
![](https://i.imgur.com/QNYsm4A.png)

### Bonus Function description
There are some useful features in the project

##### Outline mode / Fill mode
First, you can toggle the outline mode / fill mode be clicking the mode button twice.

*Fill mode*
![](https://i.imgur.com/fU7b8SQ.png)

*Outline mode*
![](https://i.imgur.com/wAus4os.png)

##### Download file name
You can customize the downloaded file name
![](https://i.imgur.com/ObDhm6n.png)
![](https://i.imgur.com/dlgdSpz.png)

##### Confirm reset canvas
Before you reset the canvas, it'll ask you again
![](https://i.imgur.com/uMnXIN2.png)
![](https://i.imgur.com/ZdeC3w1.png)

##### Draw square, circle, and equilateral triangle
You can draw with "Shift" key pressed, and it'll enter square mode.

##### Implemented shortcuts
![](https://i.imgur.com/5qwhG3R.png)
Check the guide, implemented some common shortcuts.

##### Sharing Module
Sharing module is available in the "Cloud Service" Menu
![](https://i.imgur.com/XyLLyLM.png)

###### Share a public canvas
![](https://i.imgur.com/0JBglg2.png)

After sharing, you'll get the 6-alphanumeric characters, everyone can input this token to load the image.
![](https://i.imgur.com/7MCRVgC.png)

Also, you can copy the link and share with others
`http://localhost:3000?load=yZt11N`

You can try it with this code `yZt11N`

###### Share a private canvas (with password)
![](https://i.imgur.com/NZP53nn.png)

If the content is important and can only be shared with a group of people, you can add the password.
![](https://i.imgur.com/k9cyaOo.png)

You'll also get a link and a token to share
`http://localhost:3000?load=BVkMjd&password=abc`
You can try it with this code `BVkMjd` and password `abc`

###### Load a canvas
If you get a sharing code, you can input the information to load
![](https://i.imgur.com/SQJoUO7.png)

It'll load into the canvas
![](https://i.imgur.com/GE14xZz.png)

###### Sharing history
You can check the sharing code created before and when did it create in the "Sharing History"
![](https://i.imgur.com/UEphvUg.png)

### Web page link


### Others (Optional)

    Anything you want to say to TAs.

<style>
table th{
    width: 100%;
}
</style>
