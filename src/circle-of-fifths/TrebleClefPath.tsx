import { FC, SVGProps } from 'react';

const TrebleClefPath: FC<SVGProps<SVGPathElement>> = (props) => {
  return (
    <path
      {...props}
      d="M 201.68015,577.12212 C 189.21313,579.67886 177.65942,586.51955 166.63177,597.41648 C 155.59034,608.51344 149.67988,621.17042 148.71367,635.17354 C 148.10635,643.9755 150.42417,654.18527 155.50802,665.18889 C 160.57805,676.39254 168.8631,684.80307 179.94828,690.59287 C 183.70316,691.65593 185.3699,693.78091 185.17666,696.58153 C 185.10766,697.58176 183.63491,698.48513 180.17068,699.05009 C 162.23985,693.18995 147.87638,682.35004 137.25321,666.94427 C 126.64383,651.33847 121.78734,634.11963 122.71136,614.88769 C 124.73465,594.32462 132.27618,575.54928 145.32214,558.7617 C 158.58245,541.78793 174.89289,530.25054 194.2535,524.14951 L 185.31689,452.179 C 152.66838,475.65388 125.76626,500.53025 104.38237,527.19434 C 83.012279,553.65841 70.901511,583.1733 67.84952,615.72521 C 67.242971,630.35613 69.270926,644.76683 73.947196,658.75728 C 78.609662,672.94777 86.176175,685.93166 96.61914,698.10905 C 117.71939,722.27758 146.38304,736.11416 182.19525,739.79114 C 194.48283,739.83498 207.66916,738.53387 221.95477,735.90162 L 201.68015,577.12212 z M 216.25638,576.11791 L 236.92479,732.1106 C 268.66231,721.83866 285.96656,695.89805 288.80996,654.68888 C 287.95758,640.76129 284.80274,628.0818 278.74385,616.6089 C 272.89929,604.94982 264.68326,595.53905 253.89522,588.3628 C 243.1072,581.18653 230.6946,577.11413 216.25638,576.11791 z M 189.50255,365.23515 C 196.39612,361.69086 204.49939,355.2151 213.39751,345.98021 C 222.2818,336.94535 231.08979,326.09629 239.59334,313.81922 C 248.31123,301.35594 255.43867,288.58193 260.97568,275.4972 C 266.49887,262.6125 269.5743,250.16189 270.37486,238.55931 C 270.71993,233.5582 270.66394,228.52941 269.96496,224.05925 C 269.65973,216.8023 267.84037,211.04887 264.29255,206.98512 C 260.73091,203.12142 256.0562,200.78891 250.04029,200.37381 C 238.00843,199.54364 226.66906,206.19811 216.02218,220.33725 C 207.71915,232.62816 200.45368,247.40261 194.85495,264.30203 C 189.0419,281.38766 185.24795,298.41163 183.64604,315.78782 C 183.28222,335.66141 185.37268,352.0864 189.50255,365.23515 z M 176.06855,375.96604 C 169.28073,342.93619 166.54493,309.58293 167.86115,275.90628 C 169.5524,254.31532 173.15233,234.26302 178.66095,215.74939 C 183.96903,197.22194 190.90246,181.41959 199.48882,167.94227 C 207.87467,154.4511 217.22903,144.44371 227.35143,137.90624 C 236.41593,132.09979 242.86704,129.12796 246.27607,129.36318 C 248.88296,129.54305 251.01979,130.69548 252.90087,132.63425 C 254.78195,134.57302 257.18181,137.75355 260.11425,141.97582 C 281.64472,177.42988 290.86079,219.06914 287.5757,266.67973 C 286.01598,289.28476 281.48971,311.08211 273.95546,332.67191 C 266.63557,354.0755 256.57724,374.28516 243.8081,392.9008 C 230.82464,411.70266 216.0153,427.76557 199.16576,441.27574 L 209.97043,521.21402 C 218.86279,520.8226 224.93393,520.43752 228.34295,520.67273 C 243.5833,521.7243 256.99854,525.8659 269.19028,533.13901 C 281.38203,540.41214 291.61718,549.76121 299.68137,561.37246 C 307.75937,572.78367 313.72164,585.65687 317.56818,599.99205 C 321.21419,614.3134 322.81348,629.09653 321.76446,644.2999 C 320.13573,667.90516 312.42856,689.08103 298.65677,707.62749 C 284.88499,726.17395 265.25562,739.09032 239.55434,746.56283 C 240.48225,756.47569 242.30967,770.87257 245.26476,789.3672 C 248.0055,808.04803 250.00586,822.8588 251.26582,833.79954 C 252.52577,844.7403 252.61014,855.198 251.90619,865.40025 C 250.81577,881.20386 246.03949,894.94397 237.56353,906.82095 C 228.88706,918.68408 217.79692,927.56673 204.0926,933.45504 C 190.58879,939.3572 175.91593,941.76168 160.27452,940.68242 C 138.21614,939.16045 119.39308,931.63081 103.79152,918.2935 C 88.203778,904.75621 80.526062,887.54368 81.187044,866.28353 C 82.437365,856.92305 85.250533,848.27326 89.840868,840.14812 C 94.431205,832.02298 100.31483,825.59505 107.69229,820.87818 C 114.88301,815.94739 123.29802,813.71407 132.76437,813.76428 C 140.58507,814.30391 147.85288,817.01632 154.58159,821.70157 C 161.09597,826.57297 166.31056,832.76164 170.011,840.45386 C 173.5109,848.13225 175.15082,856.48629 174.5435,865.28823 C 173.72913,877.09086 169.02838,886.8163 160.44122,894.46467 C 151.85408,902.11304 141.33714,905.6084 129.10477,904.76429 L 124.49256,904.44608 C 131.48509,916.98839 143.89116,924.07531 161.73841,925.30675 C 170.76229,925.92935 180.12474,924.56542 189.59761,921.6011 C 199.2848,918.45054 207.45058,913.98901 214.50978,908.0442 C 221.569,902.0993 226.44997,895.60223 228.75164,888.52522 C 232.72659,880.55863 235.1176,869.26678 236.0976,855.06362 C 236.76014,845.4615 236.42002,835.79021 235.27778,826.06352 C 234.12174,816.53691 232.18389,803.74039 229.45043,787.874 C 226.70317,772.2077 224.72391,760.01129 223.68559,751.6988 C 211.44668,753.86928 198.90336,754.61179 185.86885,753.71243 C 164.01101,752.20426 143.65999,746.37811 124.82964,736.03398 C 105.99928,725.68985 89.809943,712.11099 76.074886,695.08354 C 62.540374,678.06992 52.352377,659.27724 45.538506,638.3054 C 38.911364,617.54744 36.163324,596.05217 37.481102,574.03344 C 39.691119,553.68424 44.853882,534.34277 53.342859,516.43679 C 61.845634,498.33074 72.2847,481.36331 84.846791,465.74834 C 97.40888,450.13337 110.27541,435.94638 123.43258,423.38743 C 136.77648,411.04234 154.19272,395.15931 176.06855,375.96604 z"
    />
  );
};

export default TrebleClefPath;
