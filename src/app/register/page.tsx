'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import styles from '../../styles/register.module.css'

export default function RegisterPage() {
    return (
        <>
            <div className={styles.container}>
                <button className={styles.button}
                    onClick={() => {
                        console.log('clicked')
                    }}
                >
                    <FontAwesomeIcon 
                        icon={faGoogle} 
                        className={styles.icon} 
                    />
                    <p className="font-medium text-gray-700 text-sm">Cadastre-se com Google</p>
                </button>
            </div>
        </>
    )
}   