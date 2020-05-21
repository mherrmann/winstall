import React from "react";
import styles from "../styles/footer.module.scss";

export default function Footer(){
    return (
        <div className={styles.footer}>
            <p><a href="https://twitter.com/mehedih_" target="_blank" rel="noopener noreferrer">Built by Mehedi Hassan</a> // <a href="https://twitter.com/mehedih_" target="_blank" rel="noopener noreferrer">Contribute on GitHub</a></p>
            <p className={styles.disclaimer}>winstall is not associated with Microsoft or Windows.</p>
        </div>
    )
}