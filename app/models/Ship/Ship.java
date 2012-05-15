package models.Ship;

/**
 * Created by IntelliJ IDEA.
 * User: NoePodesta
 * Date: 15/05/12
 * Time: 00:56
 * To change this template use File | Settings | File Templates.
 */
public abstract class Ship {

    private String name;
    private int size;
    private String[] position;

    public abstract String getName();

    public abstract int getSize();

    public String[] getPosition() {
        return position;
    }

    public void setPosition(String[] position) {
        this.position = position;
    }


}
