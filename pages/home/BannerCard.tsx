import React, { useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import styles from "./Home.module.scss";

const bannerList = [
	{
		url: "https://www.bithumb.com/",
		backgroundImage: "https://www.serebii.net/pokemongo/pokemon/001.png",
	},
	{
		url: "https://www.codestates.com/",
		backgroundImage: "https://www.serebii.net/pokemongo/pokemon/002.png",
	},
	{
		url: "https://www.bithumb.com/",
		backgroundImage: "https://www.serebii.net/pokemongo/pokemon/003.png",
	},
	{
		url: "https://www.bithumb.com/",
		backgroundImage: "https://www.serebii.net/pokemongo/pokemon/001.png",
	},
	{
		url: "https://www.codestates.com/",
		backgroundImage: "https://www.serebii.net/pokemongo/pokemon/002.png",
	},
	{
		url: "https://www.bithumb.com/",
		backgroundImage: "https://www.serebii.net/pokemongo/pokemon/003.png",
	},
];

const BannerCard = () => {
	const [currentSlide, setCurrentSlide] = useState<number>(0);

	const activeDots = {
		backgroundColor: "#ffffff",
		outline: 0,
		width: 10,
		height: 10,
		display: "flex",
		flexDirection: "row",
	};
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		autoplaySpeed: 3000,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		nextArrow: <SampleNextArrow />,
		prevArrow: <SamplePrevArrow />,
		dotsClass: styles.button__bar,
		beforeChange: (prev: any, next: any) => {
			setCurrentSlide(next);
		},
		appendDots: (dots: any) => {
			return (
				<div>
					<ul style={{ padding: 0 }}>
						{dots.map((item: any, index: number) => {
							return <li key={index}>{item.props.children}</li>;
						})}
					</ul>
				</div>
			);
		},
		customPaging: (index: number) => {
			return (
				<div style={index === currentSlide ? activeDots : {}}>{index + 1}</div>
			);
		},
	};

	return (
		<div className={styles.banner_image_wrap}>
			<Slider {...settings}>
				{bannerList.map((item, i) => {
					return (
						<Link href={item.url} key={i}>
							<div
								className={styles.bannerImageWrap}
								style={{
									backgroundImage: `url(${item.backgroundImage})`,
								}}
							></div>
						</Link>
					);
				})}
			</Slider>
		</div>
	);
};

export default BannerCard;

function SamplePrevArrow(props: any) {
	const { className, style, onClick } = props;
	return (
		<div className={styles.bannerArrowBtn} onClick={onClick}>
			<img
				src={"/images/home_banner_prev_arrow.png"}
				style={{ marginLeft: "11px", marginTop: "10px" }}
			/>
		</div>
	);
}

function SampleNextArrow(props: any) {
	const { className, style, onClick } = props;
	return (
		<div
			className={styles.bannerArrowBtn}
			style={{ right: "0px" }}
			onClick={onClick}
		>
			<img
				src={"/images/home_banner_next_arrow.png"}
				style={{ marginLeft: "16px", marginTop: "10px" }}
			/>
		</div>
	);
}
