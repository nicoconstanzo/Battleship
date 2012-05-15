package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 00:56
 * To change this template use File | Settings | File Templates.
 */
public class Ship {

    private String name;
    private int size;
    private int hit;
    private String[] position;



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String[] getPosition() {
        return position;
    }

    public void setPosition(String[] position) {
        this.position = position;
    }
    
    public boolean isSunk(){
       return hit == getSize();
    }

    public int getHit() {
        return hit;
    }

    public void setHit(int hit) {
        this.hit = hit;
    }

}
