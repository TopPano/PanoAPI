This code implements the projection model described in 

	Rectangling Stereographic Projection for Wide-Angle Image Visualization
	Che-Han Chang, Min-Chun Hu, Wen-Huang Cheng, and Yung-Yu Chuang,
	ICCV 2013.

If you use this code, please cite the publication above.
Any questions, please email to frank@cmlab.csie.ntu.edu.tw

=======================
==== How to use it ====
=======================

(1) install lsd
This code use lsd detector [1] to find line segments.
The lsd matlab interface used here is provided by Chen Feng [2].
Run lsd-1.5/compile.m to make sure that lsd works.

(2) run example.m
example.m shows four examples of running spherical panorama projection.
The input image has to be of equirectangular format with aspect ratio 2:1.
The result image is stored at Results/.
The four example images are downloaded from [3].

=====================
==== References =====
=====================
[1] Grompone, G., Jakubowicz, J., Morel, J. and Randall, G.
    LSD: A Fast Line Segment Detector with a False Detection Control.
    IEEE Transactions on Pattern Analysis and Machine Intelligence, 32:722¡V732, 2010.
[2] http://code.google.com/p/vpdetection/
[3] https://www.flickr.com/photos/gadl/