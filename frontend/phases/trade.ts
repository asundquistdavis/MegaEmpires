import axios from "axios";
import { Client } from "../components/client";
import { CardUI } from "../components/card";
import { TradeCardHandIU } from "../components/tradeCard";
import { TradeCard } from "../objects/TradeCard";
import '../styles/trade__phase.scss';

export async function trade(this:Client) {
    // this.gui.actionCard.element.remove();
    const actionCard = this.gui.actionCard as CardUI;
    const hand = TradeCardHandIU.new(actionCard.content.id, 'hand');
    hand.tradeCards = Array.from(Array(20)).map(()=>new TradeCard('Superstition', 'commodity', 5, 9, 'red', 'green', 'blue'));
    this.gui.playerCard.show()
}
