import React from 'react';
import cards from '../cards';
import { supportCardProperties } from '../constants';
import SpeedIcon from '../../icons/utx_ico_obtain_00.png';
import StaminaIcon from '../../icons/utx_ico_obtain_01.png';
import PowerIcon from '../../icons/utx_ico_obtain_02.png';
import GutsIcon from '../../icons/utx_ico_obtain_03.png';
import WisdomIcon from '../../icons/utx_ico_obtain_04.png';
import FriendIcon from '../../icons/utx_ico_obtain_05.png';

const type_to_icon = [
    SpeedIcon,
    StaminaIcon,
    PowerIcon,
    GutsIcon,
    WisdomIcon,
    "",
    FriendIcon,
];

class InventoryManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            selectedType: -1,
            selectedRarity: -1
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleRarityChange = this.handleRarityChange.bind(this);
        this.handleLBChange = this.handleLBChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    handleTypeChange(event) {
        this.setState({ selectedType: parseInt(event.target.value) });
    }

    handleRarityChange(event) {
        this.setState({ selectedRarity: parseInt(event.target.value) });
    }

    handleLBChange(cardId, lb) {
        const newInventory = { ...this.props.inventory };
        if (lb === -1) {
            delete newInventory[cardId];
        } else {
            newInventory[cardId] = lb;
        }
        this.props.onInventoryUpdate(newInventory);
    }

    handleCancel() {
        this.props.onClose();
    }

    render() {
        const filteredCards = cards.filter(card => {
            // Only show one instance of each card (using max limit break)
            if (card.limit_break !== 4) return false;

            const matchesSearch = card.char_name.toLowerCase().includes(this.state.searchTerm.toLowerCase());
            const matchesType = this.state.selectedType === -1 || card.type === this.state.selectedType;
            const matchesRarity = this.state.selectedRarity === -1 || Math.floor(card.id / 10000) === this.state.selectedRarity;
            return matchesSearch && matchesType && matchesRarity;
        });

        const typeOptions = [
            { value: -1, label: 'All Types' },
            { value: 0, label: 'Speed' },
            { value: 1, label: 'Stamina' },
            { value: 2, label: 'Power' },
            { value: 3, label: 'Guts' },
            { value: 4, label: 'Wisdom' },
            { value: 6, label: 'Friend' }
        ];

        const rarityOptions = [
            { value: -1, label: 'All Rarities' },
            { value: 1, label: 'R' },
            { value: 2, label: 'SR' },
            { value: 3, label: 'SSR' }
        ];

        return (
            <div className="inventory-manager-overlay">
                <div className="inventory-manager-content">
                    <div className="inventory-header">
                        <h2>Manage Inventory</h2>
                        <button onClick={this.handleCancel} className="close-btn">×</button>
                    </div>

                    <div className="inventory-manager-controls">
                        <div className="search-section">
                            <input
                                type="text"
                                placeholder="Search cards..."
                                value={this.state.searchTerm}
                                onChange={this.handleSearchChange}
                                className="search-input"
                            />
                        </div>

                        <div className="filter-section">
                            <select value={this.state.selectedType} onChange={this.handleTypeChange}>
                                {typeOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>

                            <select value={this.state.selectedRarity} onChange={this.handleRarityChange}>
                                {rarityOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="settings-section">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={this.props.disableGraying}
                                    onChange={this.props.onToggleDisableGraying}
                                />
                                Disable graying of unowned cards
                            </label>
                        </div>
                    </div>

                    <div className="inventory-grid">
                        {filteredCards.map(card => {
                            const currentLB = this.props.inventory[card.id] !== undefined ? this.props.inventory[card.id] : -1;
                            return (
                                <div key={card.id} className="inventory-card-item">
                                    <div className="inventory-card-image">
                                        <img
                                            src={"./cardImages/support_card_s_" + card.id + ".png"}
                                            alt={card.char_name}
                                            title={card.char_name}
                                        />
                                        {this.state.selectedType === -1 && (
                                            <img 
                                                src={type_to_icon[card.type]} 
                                                className="card-type-icon" 
                                                alt="Type"
                                            />
                                        )}
                                    </div>
                                    <div className="inventory-card-info">
                                        <div className="card-name">{card.char_name}</div>
                                        <div className="lb-selector">
                                            <label>Limit Break:</label>
                                            <select
                                                value={currentLB}
                                                onChange={(e) => this.handleLBChange(card.id, parseInt(e.target.value))}
                                            >
                                                <option value={-1}>Not Owned</option>
                                                <option value={0}>0★</option>
                                                <option value={1}>1★</option>
                                                <option value={2}>2★</option>
                                                <option value={3}>3★</option>
                                                <option value={4}>4★</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="inventory-actions">
                        <button onClick={this.handleCancel} className="cancel-btn">Close</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default InventoryManager;