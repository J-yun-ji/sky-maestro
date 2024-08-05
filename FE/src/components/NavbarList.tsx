import { useNavigate } from "react-router-dom";
import styles from "../styles/components/NavbarList.module.css";

type NavbarListProps = {
    icon: React.ReactNode;
    title: string;
    navigateTo: string;
    isSelected: boolean;
    setSelected: (title: string) => void;
};

function NavbarList({
                        icon,
                        title,
                        navigateTo,
                        isSelected,
                        setSelected,
                    }: NavbarListProps) {
    const navigate = useNavigate();

    const handleNavigateTo = () => {
        const token = localStorage.getItem('token');
        if (!token && title === '마이페이지') {
            console.log('No token found, redirecting to login.');
            navigate('/login');
        } else {
            navigate(navigateTo);
            setSelected(title);
        }
    };

    return (
        <div className={styles.container} onClick={handleNavigateTo}>
            <li className={isSelected ? styles.selected : styles.notSelected}>
                <p className={styles.icon}>{icon}</p>
                <p>{title}</p>
            </li>
        </div>
    );
}

export default NavbarList;
